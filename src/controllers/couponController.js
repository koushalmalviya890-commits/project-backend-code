const mongoose = require('mongoose');
const ServiceProvider = require('../models/ServiceProvider');
const Facility = require('../models/Facility');

// --- 1. GET ALL COUPONS ---
exports.getCoupons = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    const serviceProvider = await ServiceProvider.findOne({ userId });
    
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    res.status(200).json({
      success: true,
      data: serviceProvider.coupons || []
    });
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 2. CREATE COUPON ---
exports.createCoupon = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { 
      couponCode, discount, minimumValue, validFrom, validTo,
      usageLimit, applicableFacilities 
    } = req.body;

    // Validation
    if (!couponCode || !discount || minimumValue === undefined || !validFrom || !validTo) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (new Date(validFrom) >= new Date(validTo)) {
      return res.status(400).json({ success: false, message: 'Valid From date must be before Valid To date' });
    }

    const serviceProvider = await ServiceProvider.findOne({ userId });
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    // Check Duplicate
    const existingCoupon = serviceProvider.coupons?.find(
      (c) => c.couponCode.toUpperCase() === couponCode.toUpperCase()
    );

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    // Add New Coupon
    const newCoupon = {
      couponCode: couponCode.toUpperCase(),
      discount,
      minimumValue,
      validFrom: new Date(validFrom),
      validTo: new Date(validTo),
      isActive: true,
      usageLimit: usageLimit || null,
      usedCount: 0,
      applicableFacilities: applicableFacilities || [],
      createdAt: new Date()
    };

    serviceProvider.coupons = serviceProvider.coupons || [];
    serviceProvider.coupons.push(newCoupon);
    await serviceProvider.save();

    res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      data: newCoupon
    });
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 3. UPDATE COUPON ---
exports.updateCoupon = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { couponId } = req.params;
    const updateData = req.body;

    // Date Validation
    if (updateData.validFrom && updateData.validTo) {
      if (new Date(updateData.validFrom) >= new Date(updateData.validTo)) {
        return res.status(400).json({ success: false, message: 'Valid From date must be before Valid To date' });
      }
    }

    const serviceProvider = await ServiceProvider.findOne({ userId });
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    const couponIndex = serviceProvider.coupons?.findIndex(
      (c) => c._id.toString() === couponId
    );

    if (couponIndex === -1 || couponIndex === undefined) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    const allowedFields = ['couponCode', 'discount', 'minimumValue', 'validFrom', 'validTo', 'isActive', 'usageLimit', 'applicableFacilities'];
    const coupon = serviceProvider.coupons[couponIndex];

    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (field === 'validFrom' || field === 'validTo') {
          coupon[field] = new Date(updateData[field]);
        } else {
          coupon[field] = updateData[field];
        }
      }
    });

    await serviceProvider.save();

    res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      data: serviceProvider.coupons[couponIndex]
    });
  } catch (error) {
    console.error('Error updating coupon:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 4. DELETE COUPON ---
exports.deleteCoupon = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    const { couponId } = req.params;

    const serviceProvider = await ServiceProvider.findOne({ userId });
    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    const couponIndex = serviceProvider.coupons?.findIndex(
      (c) => c._id.toString() === couponId
    );

    if (couponIndex === -1 || couponIndex === undefined) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    serviceProvider.coupons.splice(couponIndex, 1);
    await serviceProvider.save();

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- 5. VALIDATE COUPON ---
// Public route (usually) to check if coupon is valid for booking
exports.validateCoupon = async (req, res) => {
  try {
    const { facilityId } = req.params;
    const { couponCode, bookingAmount } = req.body;

    if (!couponCode || !bookingAmount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!mongoose.Types.ObjectId.isValid(facilityId)) {
       return res.status(400).json({ success: false, message: 'Invalid Facility ID' });
    }
    // 1. Get Facility
    const facility = await Facility.findById(facilityId);
    if (!facility) {
      return res.status(404).json({ success: false, message: 'Facility not found' });
    }

    // 2. Get Service Provider
    // (Handles legacy data where ID references vary)
    const serviceProvider = await ServiceProvider.findOne({
      $or: [
        { _id: facility.serviceProviderId },
        { userId: facility.serviceProviderId }
      ]
    });

    if (!serviceProvider) {
      return res.status(404).json({ success: false, message: 'Service provider not found' });
    }

    // 3. Find Coupon
    const coupon = serviceProvider.coupons?.find(
      (c) => c.couponCode.toUpperCase() === couponCode.toUpperCase()
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code' });
    }

    // 4. Run Validations
    const now = new Date();

    if (!coupon.isActive) {
      return res.status(400).json({ success: false, message: 'This coupon is no longer active' });
    }
    if (now < new Date(coupon.validFrom)) {
      return res.status(400).json({ success: false, message: 'This coupon is not yet valid' });
    }
    if (now > new Date(coupon.validTo)) {
      return res.status(400).json({ success: false, message: 'This coupon has expired' });
    }
    if (bookingAmount < coupon.minimumValue) {
      return res.status(400).json({ success: false, message: `Minimum booking amount of ₹${coupon.minimumValue} required` });
    }
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: 'This coupon has reached its usage limit' });
    }
    if (coupon.applicableFacilities && coupon.applicableFacilities.length > 0) {
      const isApplicable = coupon.applicableFacilities.some(
        (id) => id.toString() === facilityId
      );
      if (!isApplicable) {
        return res.status(400).json({ success: false, message: 'This coupon is not applicable to this facility' });
      }
    }

    // 5. Calculate Discount
    const discountAmount = (bookingAmount * coupon.discount) / 100;
    const finalAmount = bookingAmount - discountAmount;

    res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      data: {
        couponCode: coupon.couponCode,
        discount: coupon.discount,
        discountAmount: Math.round(discountAmount * 100) / 100,
        originalAmount: bookingAmount,
        finalAmount: Math.round(finalAmount * 100) / 100,
        couponId: coupon._id
      }
    });

  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  }
};