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
const Razorpay = require("razorpay");
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


// exports.calculateAffiliatePrice = async (req, res) => {
//   try {
//     const { facilityId, basePrice: inputBasePrice, rentalPlan, unitCount, bookingSeats } = req.body;

//     // 1. Validation
//     if (!facilityId) {
//       return res.status(400).json({ error: "Missing facilityId" });
//     }

//     // 2. Fetch Facility
//     const facility = await Facility.findById(facilityId);
//     if (!facility) {
//       return res.status(404).json({ error: "Facility not found" });
//     }

//     // 3. Determine Base Price
//     // If frontend sends basePrice, use it. Otherwise calculate from plan.
//     let basePrice = inputBasePrice;
    
//     if (!basePrice && rentalPlan && unitCount) {
//        const plan = facility.details?.rentalPlans?.find(
//         (p) => p.name.toLowerCase().trim() === rentalPlan.toLowerCase().trim()
//       );
//       if (plan) {
//         basePrice = plan.price * unitCount * (bookingSeats || 1);
//       }
//     }

//     if (!basePrice) {
//        return res.status(400).json({ error: "Could not determine base price" });
//     }

//     // 4. Fetch Service Provider
//     const serviceProvider = await ServiceProvider.findOne({
//       userId: facility.serviceProviderId,
//     });
    
//     if (!serviceProvider) {
//       return res.status(404).json({ error: "Service Provider not found" });
//     }

//     // 5. Affiliate Pricing Logic
//     // Logic: Always New User, Rate = 0.07, GST on Total
//     const hasGST = !!serviceProvider.gstNumber;
//     const rate = 0.07;
    
//     // Fee Calculation
//     const fixedFee = basePrice * rate;
//     const totalBeforeGST = basePrice + fixedFee;
    
//     let gst = 0;
//     let finalPrice = 0;

//     if (hasGST) {
//       // GST is 18% of the Total (Base + Fee)
//       gst = totalBeforeGST * 0.18;
//       finalPrice = totalBeforeGST + gst;
//     } else {
//       gst = 0;
//       finalPrice = totalBeforeGST;
//     }

//     // 6. Return Response
//     res.json({
//       success: true,
//       data: {
//         basePrice,
//         fixedFee,
//         hasGST,
//         isExistingUser: false, // Affiliate users are always treated as new
//         gst: Math.round(gst),
//         finalPrice: Math.round(finalPrice),
//         distanceInKm: 0 // Not used for affiliates
//       }
//     });

//   } catch (error) {
//     console.error("Affiliate Pricing Error:", error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


//user
exports.createAffiliateUser = async (req, res) => {
  try {
    const { mailId, contactNumber, contactName, affiliateId } = req.body;

    if (mailId && !/^\S+@\S+\.\S+$/.test(mailId)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    const exists = await AffiliateLinkUser.findOne({ mailId });
    if (exists) {
      return res.status(409).json({ error: "User already exists" });
    }

    const user = await AffiliateLinkUser.create({
      mailId,
      contactNumber,
      contactName,
      affiliateId,
      createdAt: new Date(),
    });

    return res.status(201).json({
      message: "Affiliate user created",
      user
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//user/visitor
exports.trackAffiliateVisitor = async (req, res) => {
  try {
    const { affiliateId } = req.body;

    const affiliate = await mongoose.connection
      .collection("affiliatepartners")
      .findOne({ _id: new mongoose.Types.ObjectId(affiliateId) });

    if (!affiliate) {
      await mongoose.connection.collection("affiliatepartners").insertOne({
        _id: new mongoose.Types.ObjectId(affiliateId),
        visitors: 1,
        createdAt: new Date()
      });
    } else {
      await mongoose.connection.collection("affiliatepartners").updateOne(
        { _id: new mongoose.Types.ObjectId(affiliateId) },
        { $inc: { visitors: 1 } }
      );
    }

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


//user/customers
exports.trackAffiliateCustomer = async (req, res) => {
  try {
    const { startupMailId } = req.body;

    const affiliateUser = await AffiliateLinkUser.findOne({
      mailId: startupMailId
    });

    if (!affiliateUser?.affiliateId) {
      return res.status(404).json({ error: "Affiliate not found" });
    }

    await mongoose.connection.collection("affiliatepartners").updateOne(
      { _id: new mongoose.Types.ObjectId(affiliateUser.affiliateId) },
      { $inc: { customers: 1 } }
    );

    res.json({ success: true });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//pricing
exports.calculateAffiliatePrice = async (req, res) => {
  try {
    const { facilityId, basePrice } = req.body;

    // 1️ Validation
    if (!facilityId || !basePrice) {
      return res.status(400).json({
        error: "facilityId and basePrice are required",
      });
    }

    // 2️ Fetch Facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // 3️ Fetch Service Provider
    const serviceProvider = await ServiceProvider.findOne({
      userId: facility.serviceProviderId,
    });

    if (!serviceProvider) {
      return res.status(404).json({ error: "Service Provider not found" });
    }

    // 4️ Check GST
    const hasGST = !!serviceProvider.gstNumber;

    // 5️ Apply Affiliate Pricing Logic 
    const rate = 0.07;
    const fixedFee = basePrice * rate;

    const totalBeforeGST = basePrice + fixedFee;

    let gst = 0;
    let finalPrice = totalBeforeGST;

    if (hasGST) {
      gst = totalBeforeGST * 0.18;
      finalPrice = totalBeforeGST; //  
    } else {
      finalPrice = totalBeforeGST;
    }

    // 6️ Response (Exact Structure)
    return res.status(200).json({
      success: true,
      data: {
        basePrice,
        fixedFee,
        hasGST,
        isExistingUser: false,
        gst: hasGST ? Math.round(gst) : 0,
        finalPrice: Math.round(finalPrice),
        distanceInKm: 0,
      },
    });

  } catch (error) {
    console.error("Affiliate Pricing Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//pricing-detail-page
exports.calculateAffiliatePriceDetail = async (req, res) => {
  try {
    const { facilityId, rentalPlan, unitCount, bookingSeats } = req.body;

    // 1️ Validation (same as Next.js route)
    if (!facilityId || !rentalPlan || !unitCount) {
      return res.status(400).json({
        error: "facilityId, rentalPlan and unitCount are required",
      });
    }

    // 2️ Fetch Facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // 3️ Find Rental Plan (case-insensitive match)
    const plan = facility.details?.rentalPlans?.find(
      (p) =>
        p.name.toLowerCase().trim() === rentalPlan.toLowerCase().trim()
    );

    if (!plan) {
      return res.status(404).json({ error: "Rental plan not found" });
    }

    // 4️ Calculate Base Price
    const basePrice = plan.price * unitCount * bookingSeats;

    // 5️ Fetch Service Provider
    const serviceProvider = await ServiceProvider.findOne({
      userId: facility.serviceProviderId,
    });

    if (!serviceProvider) {
      return res.status(404).json({ error: "Service Provider not found" });
    }

    // 6️ GST Check
    const hasGST = !!serviceProvider.gstNumber;

    // 7️ Pricing Logic 
    const rate = 0.07;
    const fixedFee = basePrice * rate;

    const totalBeforeGST = basePrice + fixedFee;

    let gstAmount = 0;
    let finalPrice = totalBeforeGST;

    if (hasGST) {
      gstAmount = totalBeforeGST * 0.18;
      finalPrice = totalBeforeGST + gstAmount; // GST ADDED 
    } else {
      finalPrice = totalBeforeGST;
    }

    // 8️ Response 
    return res.status(200).json({
      success: true,
      data: {
        basePrice,
        fixedFee,
        gstAmount,
        finalPrice: Math.round(finalPrice),
        isExistingUser: false,
        hasGST,
        distanceInKm: 0,
        bookingSeats,
      },
    });

  } catch (error) {
    console.error("Affiliate Pricing Detail Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


//payments/razorpay
//Order
exports.createAffiliateOrder = async (req, res) => {
  try {
    const {
      email,
      facilityId,
      rentalPlan,
      amount,
      originalBaseAmount,
      serviceFee,
      gstAmount,
      totalAmount,
      startDate,
      endDate,
      contactNumber,
      unitCount,
      bookingSeats,
    } = req.body;

    // 1️ Validate environment keys
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        error: "Payment service not configured",
      });
    }

    // 2️ Validate required fields (same as Next.js)
    if (
      !email ||
      !facilityId ||
      !rentalPlan ||
      typeof amount !== "number" ||
      typeof totalAmount !== "number" ||
      !startDate ||
      !endDate ||
      !contactNumber
    ) {
      return res.status(400).json({
        error: "Missing required fields for booking",
      });
    }

    // 3️ Initialize Razorpay
    const razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    // 4️ Ensure user exists
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        userType: "startup",
      });
    }

    const startupId = user._id;

    // 5️ Fetch Facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ error: "Facility not found" });
    }

    // 6️ Create pending booking (MATCHING Next.js structure)
    const bookingData = {
      facilityId: new mongoose.Types.ObjectId(facilityId),
      startupId: new mongoose.Types.ObjectId(startupId),
      incubatorId: facility.serviceProviderId,
      affiliateUserEmail: email || null, // IMPORTANT for affiliate tracking
      rentalPlan,
      status: "pending",
      paymentStatus: "pending",
      amount: totalAmount,
      baseAmount: originalBaseAmount,
      originalBaseAmount: originalBaseAmount || undefined,
      serviceFee: serviceFee || undefined,
      gstAmount: gstAmount,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      whatsappNumber: contactNumber,
      unitCount: unitCount || 1,
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      paymentRetries: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      bookingSeats: bookingSeats || 1,
    };

    const booking = await mongoose.connection
      .collection("bookings")
      .insertOne(bookingData);

    const bookingId = booking.insertedId;

    try {
      // 7️ Create Razorpay order
      const razorpayOrder = await razorpayClient.orders.create({
        amount: Math.round(totalAmount * 100),
        currency: "INR",
        receipt: bookingId.toString(),
        notes: {
          bookingId: bookingId.toString(),
          facilityId,
          startupId: startupId.toString(),
          rentalPlan,
        },
      });

      // 8️ Update booking with Razorpay order ID
      await mongoose.connection.collection("bookings").updateOne(
        { _id: bookingId },
        {
          $set: {
            razorpayOrderId: razorpayOrder.id,
            updatedAt: new Date(),
          },
        }
      );

      // 9️ Return response
      return res.status(200).json({
        orderId: razorpayOrder.id,
        bookingId: bookingId.toString(),
        amount: totalAmount,
        currency: "INR",
        keyId: RAZORPAY_KEY_ID,
      });

    } catch (razorpayError) {
      // Cleanup if order creation fails
      await mongoose.connection
        .collection("bookings")
        .deleteOne({ _id: bookingId });

      return res.status(500).json({
        error: "Failed to create payment order",
        details: razorpayError.message,
      });
    }

  } catch (error) {
    console.error("Affiliate Order Creation Error:", error);
    return res.status(500).json({
      error: "Failed to create booking",
      details: error.message,
    });
  }
};


//retry-payment
exports.retryAffiliatePayment = async (req, res) => {
  try {
    const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
    const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      return res.status(500).json({
        error: "Payment service not configured",
      });
    }

    const razorpayClient = new Razorpay({
      key_id: RAZORPAY_KEY_ID,
      key_secret: RAZORPAY_KEY_SECRET,
    });

    //  Authentication (Express version of getServerSession)
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (req.user.userType !== "startup") {
      return res.status(403).json({
        error: "Only startups can retry bookings",
      });
    }

    const { bookingId, token } = req.body;

    if (!bookingId || !mongoose.Types.ObjectId.isValid(bookingId)) {
      return res.status(400).json({
        error: "Invalid booking ID",
      });
    }

    const booking = await mongoose.connection
      .collection("bookings")
      .findOne({
        _id: new mongoose.Types.ObjectId(bookingId),
        startupId: new mongoose.Types.ObjectId(req.user.id),
      });

    if (!booking) {
      return res.status(404).json({
        error: "Booking not found or unauthorized",
      });
    }

    //  Token validation (if provided)
    if (token && booking.retryToken !== token) {
      return res.status(401).json({
        error: "Invalid retry token",
      });
    }

    // Must be failed
    if (booking.paymentStatus !== "failed") {
      return res.status(400).json({
        error: "This booking is not in a retry-able state",
      });
    }

    // Expiry check
    if (booking.expiresAt && new Date(booking.expiresAt) < new Date()) {
      return res.status(410).json({
        error: "The retry window for this booking has expired",
      });
    }

    try {
      // Create Razorpay order again
      const razorpayOrder = await razorpayClient.orders.create({
        amount: Math.round(booking.amount * 100),
        currency: "INR",
        receipt: booking._id.toString(),
        notes: {
          bookingId: booking._id.toString(),
          facilityId: booking.facilityId.toString(),
          startupId: req.user.id,
          rentalPlan: booking.rentalPlan,
          isRetry: "true",
        },
      });

      const retryAttempt = {
        razorpayOrderId: razorpayOrder.id,
        attemptedAt: new Date(),
        status: "pending",
      };

      await mongoose.connection.collection("bookings").updateOne(
        { _id: new mongoose.Types.ObjectId(bookingId) },
        {
          $set: {
            razorpayOrderId: razorpayOrder.id,
            updatedAt: new Date(),
          },
          $unset: {
            retryToken: "",
          },
          $push: {
            paymentRetries: retryAttempt,
          },
        }
      );

      return res.status(200).json({
        orderId: razorpayOrder.id,
        bookingId: bookingId,
        amount: booking.amount,
        currency: "INR",
        keyId: RAZORPAY_KEY_ID,
      });

    } catch (razorpayError) {
      return res.status(500).json({
        error: "Failed to create retry payment order",
        details: razorpayError.message,
      });
    }

  } catch (error) {
    console.error("Retry Payment Error:", error);
    return res.status(500).json({
      error: "Failed to create retry payment order",
    });
  }
};