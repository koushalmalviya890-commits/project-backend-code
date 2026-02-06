const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
//  import jwt from 'jsonwebtoken';
const jwt = require('jsonwebtoken');
// import crypto from 'crypto';
const crypto = require('crypto');
// import User from '../models/User.js';
const User = require('../models/User.js');
// import ServiceProvider from '../models/ServiceProvider.js';
const ServiceProvider = require('../models/ServiceProvider.js');
// import Startup from '../models/Startup.js';
const Startup = require('../models/Startup.js');
// import AffiliateLinkUser from '../models/AffiliateLinkUser.js';  
const AffiliateLinkUser = require('../models/AffiliateLinkUsers.js');
const {sendServiceProviderAgreementEmail} = require('../../lib/emailService.js');
const Facility = require("../models/Facility.js");
const generateAuthProviderId = (length = 24) => {
  return crypto.randomBytes(length)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, length);
};

// 1. CHECK AFFILIATE EMAIL (and create placeholder if valid)
exports.checkAffiliateEmail = async (req, res) => {
  const { email } = req.body;

  try {
    // A. Check AffiliateLinkUsers collection
    const affiliateUser = await AffiliateLinkUser.findOne({ mailId: email });
    
    if (!affiliateUser) {
      return res.status(400).json({ error: "Email not registered via affiliate link" });
    }

    // B. Check User collection
    const user = await User.findOne({ email });
    
    if (user) {
      return res.json({
        existsInUsers: true,
        hasPassword: !!user.password,
      });
    }

    // C. Logic: If valid Affiliate but NO User -> Create Placeholder User
    const newUser = await User.create({
      email: email,
      userType: "startup", // Defaulting to startup as per your logic
      authProvider: "local",
      authProviderId: generateAuthProviderId(),
      isEmailVerified: false,
    });

    // D. Create Startup Profile with data from Affiliate Record
    const startupData = {
      userId: newUser._id,
      startupMailId: affiliateUser.mailId,
      contactNumber: affiliateUser.contactNumber,
      contactName: affiliateUser.contactName || "EswarK", // Default from your code
      createdAt: new Date(),
      updatedAt: new Date(),
      isNewUser: true,
    };

    await Startup.create(startupData);

    return res.json({
      existsInUsers: false,
      hasPassword: false,
    });

  } catch (error) {
    console.error("Email check error:", error);
    return res.status(500).json({ error: error.message || "Failed to validate email" });
  }
};

// 2. SET PASSWORD (and ensure Startup profile exists)
exports.setAffiliatePassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    // A. Find User
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // B. Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // C. Update User
    user.password = hashedPassword;
    await user.save();

    // D. Ensure Startup Profile Exists (Edge Case Handling)
    const startup = await Startup.findOne({ userId: user._id });
    
    if (!startup) {
      const affiliateUser = await AffiliateLinkUser.findOne({ mailId: email });
      if (affiliateUser) {
        const startupData = {
          userId: user._id,
          startupMailId: affiliateUser.mailId,
          contactNumber: affiliateUser.contactNumber,
          contactName: affiliateUser.contactName,
          createdAt: new Date(),
          updatedAt: new Date(),
          isNewUser: true,
        };
        await Startup.create(startupData);
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Set password error:", error);
    return res.status(500).json({ error: error.message || "Failed to set password" });
  }
};


exports.registerStartup = async (req, res) => {
  const data = req.body; // Expects the full form data

  try {
    // A. Check for existing user
    let existingUser = await User.findOne({ email: data.email });

    if (existingUser) {
      if (existingUser.password && data.password) {
        return res.status(400).json({ error: "User already exists with a password" });
      }
      
      // Update password if provided
     if (data.password) {
        existingUser.password = data.password; 
        await existingUser.save();
      }
    } else {
      // B. Create New User
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = data.password ? await bcrypt.hash(data.password, salt) : null;
      
      existingUser = await User.create({
        email: data.email,
        password: data.password,
        userType: "startup",
        authProvider: "local",
        authProviderId: generateAuthProviderId(),
        isEmailVerified: false,
      });
    }

    // C. Handle Startup Profile Creation/Update
    let startup = await Startup.findOne({ userId: existingUser._id });
    
    // Base Data
    const startupData = {
      userId: existingUser._id,
      updatedAt: new Date(),
      isNewUser: true
    };
    if (!startup) startupData.createdAt = new Date();

    // Fetch Affiliate info if available
    const affiliateUser = await AffiliateLinkUser.findOne({ mailId: data.email });
    if (affiliateUser) {
      startupData.startupMailId = affiliateUser.mailId;
      startupData.contactNumber = affiliateUser.contactNumber;
      startupData.contactName = affiliateUser.contactName;
    }

    // Helper to map fields
    const fieldsToMap = [
      "startupName", "contactName", "contactNumber", "founderName", 
      "founderDesignation", "entityType", "teamSize", "dpiitNumber", 
      "cin", "gstnumber", "secondarycontactname", "secondarycontactdesignation", 
      "secondarycontactnumber", "industry", "sector", "stagecompleted", 
      "startupMailId", "website", "linkedinStartupUrl", "linkedinFounderUrl", 
      "instagramurl", "twitterurl", "address", "city", "state", "pincode", 
      "country", "category", "logoUrl", "bankName", "accountNumber", 
      "ifscCode", "accountHolderName", "bankBranch", "confirmAccountNumber"
    ];

   fieldsToMap.forEach(field => {
      if (data[field] !== undefined && data[field] !== null && data[field] !== "") {
        startupData[field] = data[field];
      }
    });

    if (Array.isArray(data.lookingFor) && data.lookingFor.length > 0) {
      startupData.lookingFor = data.lookingFor;
    }

    startupData.isProfileComplete = false;

    // D. Upsert (Update if exists, Create if not)
  await Startup.findOneAndUpdate(
      { userId: existingUser._id },
      { $set: startupData },
      { upsert: true, new: true }
    );

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({ error: error.message || "Registration failed" });
  }
};


exports.registerServiceProvider = async (req, res) => {
  const data = req.body; // In Express, data comes from req.body

  try {
    // 1. Check if user already exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // 2. Create User
    const user = await User.create({
      email: data.email,
      password: data.password, // Ensure password hashing happens here or in User model pre-save hook
      userType: "Service Provider",
      authProvider: "local",
      authProviderId: generateAuthProviderId(),
      isEmailVerified: false,
      invoiceType: data.invoiceType,
    });

    const userId = user._id;

    // 3. Validation & Cleanup
    const cleanInvoiceType = data.invoiceType?.trim().toLowerCase();
    if (!["self", "cumma"].includes(cleanInvoiceType)) {
      return res.status(400).json({ error: "Invalid invoice type value" });
    }

    const cleanApplyGst = data.applyGst?.trim().toLowerCase();
    if (!["yes", "no"].includes(cleanApplyGst)) {
      return res.status(400).json({ error: "Invalid apply GST value" });
    }

    const cleanSettlementType = data.settlementType?.trim().toLowerCase();
    if (!["monthly", "weekly"].includes(cleanSettlementType)) {
      return res.status(400).json({ error: "Invalid settlement type value" });
    }

    const cleanInvoiceTemplate = data.invoiceTemplate?.trim().toLowerCase();
    if (!["template1", "template2"].includes(cleanInvoiceTemplate)) {
      return res.status(400).json({ error: "Invalid Invoice Template Selection" });
    }

    // 4. Prepare Service Provider Data
    const serviceProviderData = {
      userId: userId,
      settlementType: cleanSettlementType,
      invoiceType: cleanInvoiceType,
      applyGst: cleanApplyGst,
      invoiceTemplate: cleanInvoiceTemplate,
      createdAt: new Date(),
      updatedAt: new Date(),
      features: Array.isArray(data.features) ? data.features : [],
      images: Array.isArray(data.images) ? data.images : [],
      timings: data.timings || {
        monday: { isOpen: false },
        tuesday: { isOpen: false },
        wednesday: { isOpen: false },
        thursday: { isOpen: false },
        friday: { isOpen: false },
        saturday: { isOpen: false },
        sunday: { isOpen: false },
      }
    };

    // Helper to conditionally add fields
    const addIfNotEmpty = (key, value) => {
      if (value !== undefined && value !== null && value !== "") {
        serviceProviderData[key] = value;
      }
    };

    addIfNotEmpty("serviceProviderType", data.serviceProviderType);
    addIfNotEmpty("serviceName", data.serviceName);
    addIfNotEmpty("address", data.address);
    addIfNotEmpty("city", data.city);
    addIfNotEmpty("stateProvince", data.stateProvince);
    addIfNotEmpty("zipPostalCode", data.zipPostalCode);
    addIfNotEmpty("primaryContact1Name", data.primaryContact1Name);
    addIfNotEmpty("primaryContact1Designation", data.primaryContact1Designation);
    addIfNotEmpty("primaryContactNumber", data.primaryContactNumber);
    addIfNotEmpty("primaryEmailId", data.email);
    addIfNotEmpty("contact2Name", data.contact2Name);
    addIfNotEmpty("contact2Designation", data.contact2Designation);
    addIfNotEmpty("alternateContactNumber", data.alternateContactNumber);
    addIfNotEmpty("alternateEmailId", data.alternateEmailId);
    addIfNotEmpty("websiteUrl", data.websiteUrl);
    addIfNotEmpty("logoUrl", data.logoUrl);
    
    // GST Logic
    if (data.gstNumber && data.gstNumber.trim() !== "") {
      serviceProviderData.gstNumber = data.gstNumber.trim();
    } else {
      serviceProviderData.gstNumber = null;
    }
    
    addIfNotEmpty("bankName", data.bankName);
    addIfNotEmpty("accountNumber", data.accountNumber);
    addIfNotEmpty("ifscCode", data.ifscCode);
    addIfNotEmpty("accountHolderName", data.accountHolderName);
    addIfNotEmpty("bankBranch", data.bankBranch);

    // 5. Save Service Provider
    const serviceProvider = await ServiceProvider.create(serviceProviderData);

    // 6. Send Agreement Email (Non-blocking)
    // In Express, we usually fire this and don't await the result to keep response fast
    sendServiceProviderAgreementEmail({
        to: data.email,
        userId: userId,
        serviceProviderName: data.primaryContact1Name || "Service Provider",
        entityType: data.serviceName || "Individual",
        aadhaarNumber: data.gstNumber || "XXXX-XXXX",
        residentialAddress: data.primaryContact1Designation || "N/A",
        businessAddress: `${data.address || ""}, ${data.city || ""}, ${data.stateProvince || ""}, ${data.zipPostalCode || ""}`,
    }).catch(emailErr => {
        console.error('Non-fatal: failed to send agreement email:', emailErr.message);
    });

    // 7. Success Response
    return res.status(201).json({ success: true, serviceProviderId: serviceProvider._id });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Catch Mongoose Validation Errors
    if (error.name === 'ValidationError') {
        return res.status(400).json({ error: error.message });
    }

    return res.status(500).json({ error: error.message || "Internal server error" });
  }
};


exports.calculateAffiliatePrice = async (req, res) => {
  try {
    const { facilityId, basePrice: inputBasePrice, rentalPlan, unitCount, bookingSeats } = req.body;

    // 1. Validation
    if (!facilityId) {
      return res.status(400).json({ error: "Missing facilityId" });
    }

    // 2. Fetch Facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // 3. Determine Base Price
    // If frontend sends basePrice, use it. Otherwise calculate from plan.
    let basePrice = inputBasePrice;
    
    if (!basePrice && rentalPlan && unitCount) {
       const plan = facility.details?.rentalPlans?.find(
        (p) => p.name.toLowerCase().trim() === rentalPlan.toLowerCase().trim()
      );
      if (plan) {
        basePrice = plan.price * unitCount * (bookingSeats || 1);
      }
    }

    if (!basePrice) {
       return res.status(400).json({ error: "Could not determine base price" });
    }

    // 4. Fetch Service Provider
    const serviceProvider = await ServiceProvider.findOne({
      userId: facility.serviceProviderId,
    });
    
    if (!serviceProvider) {
      return res.status(404).json({ error: "Service Provider not found" });
    }

    // 5. Affiliate Pricing Logic
    // Logic: Always New User, Rate = 0.07, GST on Total
    const hasGST = !!serviceProvider.gstNumber;
    const rate = 0.07;
    
    // Fee Calculation
    const fixedFee = basePrice * rate;
    const totalBeforeGST = basePrice + fixedFee;
    
    let gst = 0;
    let finalPrice = 0;

    if (hasGST) {
      // GST is 18% of the Total (Base + Fee)
      gst = totalBeforeGST * 0.18;
      finalPrice = totalBeforeGST + gst;
    } else {
      gst = 0;
      finalPrice = totalBeforeGST;
    }

    // 6. Return Response
    res.json({
      success: true,
      data: {
        basePrice,
        fixedFee,
        hasGST,
        isExistingUser: false, // Affiliate users are always treated as new
        gst: Math.round(gst),
        finalPrice: Math.round(finalPrice),
        distanceInKm: 0 // Not used for affiliates
      }
    });

  } catch (error) {
    console.error("Affiliate Pricing Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};