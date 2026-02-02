const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require("../models/User"); // Ensure you copy your User model from Nextjs to here
const ServiceProvider = require("../models/ServiceProvider"); // Copy this model too
const Startup = require("../models/Startup");
const crypto = require('crypto');
const { z } = require('zod');
const nodemailer = require('nodemailer');
const path = require('path');
// import AffiliateLinkUser from '../models/AffiliateLinkUsers.js';
// import crypto from 'crypto';
// 3. REGISTER STARTUP (Detailed Signup)


const resetPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }).regex(/^\d{6}$/, { message: 'OTP must be numbers only' }),
  newPassword: z.string().min(8, { message: 'Password must be at least 8 characters' }),
  action: z.literal('reset_password')
});

const generateToken = () => {
  return crypto.randomBytes(32).toString('hex');
};
const requestOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  action: z.literal('request_otp')
});

const verifyOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits' }).regex(/^\d{6}$/, { message: 'OTP must be numbers only' }),
  action: z.literal('verify_otp')
});

const updatePasswordSchema = z.object({
  token: z.string().min(1, 'Reset token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtppro.zoho.in', // Check your provider details
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

const sendOTPEmail = async (email, otp) => {
  const transporter = createEmailTransporter();
  
  // Note: Ensure the path to logo.png is correct for your Express server structure
  // Usually 'path' should be relative to where you run the server script
const logoPath = path.join(__dirname, '../../public/logo.png');


  const mailOptions = {
    from: `"Cumma," <${process.env.EMAIL_FROM}>`,
    to: email,
    subject: 'Password Reset OTP - Expires in 5 minutes',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <img src="cid:emailLogo" alt="Brand Logo" style="height: 60px;" />
        </div>
        <div style="text-align: center; margin-bottom: 30px;">
          <h2 style="color: #333; margin-bottom: 10px;">Password Reset Request</h2>
          <p style="color: #666; font-size: 16px;">
            You've requested to reset your password. Use the OTP below to proceed.
          </p>
        </div>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px; margin: 30px 0;">
          <div style="background: white; padding: 20px; border-radius: 8px; display: inline-block;">
            <div style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #333; font-family: 'Courier New', monospace;">
              ${otp}
            </div>
          </div>
        </div>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #dc3545; margin-bottom: 20px;">
          <p style="margin: 0; color: #721c24; font-weight: 500;">
            ⚠️ <strong>Important:</strong> This OTP expires in 5 minutes.<br/>
            Do not share it with anyone for any reason.
          </p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px; margin: 0;">
            If you didn’t request a password reset, please ignore this email.
          </p>
        </div>
      </div>
    `,
    attachments: [
      {
        filename: 'logo.png',
        path: logoPath,
        cid: 'emailLogo'
      }
    ]
  };

  await transporter.sendMail(mailOptions);
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // In authController.js, add validation at the top of login function
if (!process.env.JWT_SECRET) {
  return res.status(500).json({ 
    message: 'Server configuration error: JWT_SECRET not configured' 
  });
}
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    let logoUrl = null;

    // Check Approval Status
    if (user.userType === 'Service Provider' || user.role === 'enabler') {
      const profile = await ServiceProvider.findOne({ userId: user._id }).select('isApproved logoUrl');;
      if (!profile?.isApproved) return res.status(403).json({ message: "Pending approval" });
    logoUrl = profile?.logoUrl || null;
    }
    else if (user.userType === 'startup') {
      const profile = await Startup.findOne({ userId: user._id }).select('logoUrl');
      logoUrl = profile?.logoUrl || null;
    }

    const token = jwt.sign({ id: user._id, userType: user.userType, logoUrl }, process.env.JWT_SECRET, { expiresIn: '30d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // or 'none' if backend/frontend are on different domains in prod
      maxAge: 30 * 24 * 60 * 60 * 1000,
      path:'/',
    });

    res.json({ user: { id: user._id, email: user.email, name: user.name, userType: user.userType, logoUrl: logoUrl } });
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ... imports (User model)

exports.updateUserType = async (req, res) => {
  const { email, userType } = req.body;

  try {
    // 1. Validate Input
    if (!['startup', 'Service Provider'].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // 2. Find and Update User
    // We use findOneAndUpdate to get the result back
    const user = await User.findOneAndUpdate(
      { email: email }, 
      { $set: { userType: userType } },
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Return Success
    res.status(200).json({ success: true, user });

  } catch (error) {
    console.error("Update User Type Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getMe = async (req, res) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ message: "Not authenticated" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: "User not found" });
   res.json({
     user: {
       id: user._id, // <--- This matches what your frontend expects
       email: user.email,
       name: user.name,
       userType: user.userType,
       // Add any other fields you need here
     },
   });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.logout = (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: "Logged out" });
};



exports.completeProfile = async (req, res) => {
  // 1. Get user ID from the authenticated session (req.user)
  // Note: Your auth middleware must set req.user
  const userId = req.user._id || req.user.id; 
  
  const { userType, ...profileData } = req.body;

  try {
    // --- Step A: Update the User Model (Set User Type) ---
    const user = await User.findByIdAndUpdate(
      userId, 
      { userType },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // --- Step B: Create/Update the Specific Profile ---
    let profile;

    if (userType === 'startup') {
      // Logic adapted from your updateStartupProfile
      profile = await Startup.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        { 
            ...profileData,
            email: user.email, // Ensure email links correctly
            updatedAt: new Date() 
        },
        { new: true, upsert: true } // 'upsert' creates it if it doesn't exist
      );
    } 
    else if (userType === 'Service Provider' || userType === 'Incubator' || userType === 'Accelerator') {
      // Note: Your frontend sends specific types like 'Incubator' as serviceProviderType, 
      // but the main userType is usually 'Service Provider'.
      // If your frontend sends "Service Provider" as the main type:
      
      const updateData = {
        ...profileData,
        userId: userId,
        // Ensure arrays are initialized
        features: Array.isArray(profileData.features) ? profileData.features : [],
        images: Array.isArray(profileData.images) ? profileData.images : [],
        timings: profileData.timings || {
          monday: { isOpen: false },
          tuesday: { isOpen: false },
          wednesday: { isOpen: false },
          thursday: { isOpen: false },
          friday: { isOpen: false },
          saturday: { isOpen: false },
          sunday: { isOpen: false }
        },
        updatedAt: new Date()
      };

      profile = await ServiceProvider.findOneAndUpdate(
        { userId: new mongoose.Types.ObjectId(userId) },
        updateData,
        { new: true, upsert: true }
      );
    } else {
        return res.status(400).json({ message: "Invalid user type selected" });
    }

    // --- Step C: Return Success ---
    res.status(200).json({ 
        success: true, 
        user, 
        profile 
    });

  } catch (error) {
    console.error("Complete Profile Error:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


exports.requestPasswordReset = async (req, res) => {
  try {
const validatedData = resetPasswordSchema.parse(req.body);
    const { email } = validatedData;

    // Basic Validation
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // 1. Find the user
    const user = await User.findOne({ email });

    // 2. Even if user doesn't exist, return success to prevent email enumeration (Security Best Practice)
    if (!user) {
      return res.status(200).json({ 
        message: 'If your email is in our system, you will receive password reset instructions shortly.' 
      });
    }

    // 3. Generate token and expiry (24 hours from now)
    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // 4. Update user with reset token information
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          resetToken,
          resetTokenExpiry
        } 
      }
    );

    // 5. Construct the Link
    // Ensure APP_URL or FRONTEND_URL is set in your .env, otherwise fallback to localhost
    const appUrl = 'http://localhost:3000' || process.env.FRONTEND_URL;
    const resetLink = `${appUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    // 6. Log the link (Since we aren't sending real emails yet)
    console.log('Password reset link:', resetLink);

    // 7. Return success response
    return res.status(200).json({ 
      message: 'If your email is in our system, you will receive password reset instructions shortly.' 
    });

  }catch (error) {
    console.error('Password reset request error:', error);

    // H. Handle Zod Validation Errors specificially
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid input data',
        details: error.errors // Optional: send back specific validation issues
      });
    }

    return res.status(500).json({ error: 'Failed to process password reset request' });
  }
};

exports.handleDirectPasswordReset = async (req, res) => {
  try {
    const { action } = req.body;

    switch (action) {
      case 'request_otp':
        return await handleOTPRequest(req, res);
      case 'verify_otp':
        return await handleOTPVerification(req, res);
      case 'reset_password':
        return await handlePasswordReset(req, res);
      default:
        return res.status(400).json({ error: 'Invalid action' });
    }
  } catch (error) {
    console.error('Password reset error:', error);
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(err => err.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }
    return res.status(500).json({ error: 'Failed to process request' });
  }
};

exports.updatePassword = async (req, res) => {
  try {
    // 1. Validate Input
    const validatedData = updatePasswordSchema.parse(req.body);
    const { token, email, password } = validatedData;

    // 2. Find the user
    // Criteria: Email matches, Token matches, and Token is NOT expired
    const user = await User.findOne({
      email,
      resetToken: token,
      resetTokenExpiry: { $gt: new Date() } 
    });

    // 3. Handle Invalid/Expired Token
    if (!user) {
      return res.status(400).json({ 
        error: 'Invalid or expired password reset link' 
      });
    }

    // 4. Hash the new password
    // Note: We hash manually here because we are using updateOne below, 
    // which skips the Mongoose 'pre-save' hook.
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Update user
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          password: hashedPassword
        },
        $unset: { 
          resetToken: "", 
          resetTokenExpiry: "" 
        }
      }
    );

    // 6. Return Success
    res.status(200).json({ 
      message: 'Password has been successfully updated' 
    });

  } catch (error) {
    console.error('Password update error:', error);

    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Invalid input data', 
        details: error.errors 
      });
    }

    res.status(500).json({ error: 'Failed to update password' });
  }
};

// --- Sub-Handlers ---

async function handleOTPRequest(req, res) {
  const validatedData = requestOtpSchema.parse(req.body);
  const { email } = validatedData;

  const user = await User.findOne({ email }).select('+resetOTP +resetOTPCreatedAt +resetOTPExpiry');

  if (!user) {
    return res.status(404).json({ success: false, error: 'Email not found. Please register first.' });
  }

  const otp = generateOTP();
  const now = new Date();
  const otpExpiry = new Date(now.getTime() + 5 * 60 * 1000); // 5 minutes

  // Direct DB update to set OTP fields
  await User.findByIdAndUpdate(user._id, {
    resetOTP: otp,
    resetOTPCreatedAt: now,
    resetOTPExpiry: otpExpiry
  });

  try {
    await sendOTPEmail(email, otp);
    if (process.env.NODE_ENV === 'development') {
      console.log(`🔐 OTP for ${email}: ${otp}`);
    }
  } catch (emailError) {
    console.error('❌ Failed to send OTP email:', emailError);
    return res.status(500).json({ 
      success: false, 
      error: 'OTP generation succeeded but email failed. Please try again.' 
    });
  }

  return res.status(200).json({ 
    success: true, 
    message: 'OTP sent successfully. Please check your email.' 
  });
}

async function handleOTPVerification(req, res) {
  const validatedData = verifyOtpSchema.parse(req.body);
  const { email, otp } = validatedData;

  const user = await User.findOne({ email }).select('+resetOTP +resetOTPCreatedAt +resetOTPExpiry');

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (!user.resetOTP || !user.resetOTPCreatedAt) {
    return res.status(400).json({ success: false, error: 'No OTP found. Please request a new OTP.' });
  }

  // Use model method isOTPExpired
  if (user.isOTPExpired()) {
    await User.findByIdAndUpdate(user._id, {
      $unset: { resetOTP: 1, resetOTPCreatedAt: 1, resetOTPExpiry: 1 }
    });
    return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new OTP.' });
  }

  // Use model method isOTPValid
  if (!user.isOTPValid(otp)) {
    return res.status(400).json({ success: false, error: 'Invalid OTP. Please check and try again.' });
  }

  return res.status(200).json({ 
    success: true, 
    message: 'OTP verified successfully. You can now reset your password.' 
  });
}

async function handlePasswordReset(req, res) {
  const validatedData = resetPasswordSchema.parse(req.body);
  const { email, otp, newPassword } = validatedData;

  const user = await User.findOne({ email }).select('+resetOTP +resetOTPCreatedAt +resetOTPExpiry');

  if (!user) {
    return res.status(404).json({ success: false, error: 'User not found' });
  }

  if (!user.resetOTP || !user.resetOTPCreatedAt) {
    return res.status(400).json({ success: false, error: 'No valid OTP found. Please request a new OTP.' });
  }

  if (user.isOTPExpired()) {
    await User.findByIdAndUpdate(user._id, {
      $unset: { resetOTP: 1, resetOTPCreatedAt: 1, resetOTPExpiry: 1 }
    });
    return res.status(400).json({ success: false, error: 'OTP has expired. Please request a new OTP.' });
  }

  if (!user.isOTPValid(otp)) {
    return res.status(400).json({ success: false, error: 'Invalid OTP. Please verify your OTP first.' });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear OTP
  await User.findByIdAndUpdate(user._id, {
    password: hashedPassword,
    $unset: { resetOTP: 1, resetOTPCreatedAt: 1, resetOTPExpiry: 1 }
  });

  return res.status(200).json({ 
    success: true, 
    message: 'Password has been reset successfully. You can now login with your new password.' 
  });
}


// exports.completeProfile = async (req, res) => {
//   const { userType, ...profileData } = req.body;
//   const userId = req.user.id; // Assumes your auth middleware sets req.user

//   try {
//     // 1. Update the User Model to set the userType
//     await User.findByIdAndUpdate(userId, { userType });

//     // 2. Update/Create the specific Profile
//     if (userType === 'startup') {
//        // Logic from updateStartupProfile
//        await Startup.findOneAndUpdate(
//          { userId: new mongoose.Types.ObjectId(userId) },
//          { ...profileData, updatedAt: new Date() },
//          { new: true, upsert: true } // 'upsert: true' creates it if it doesn't exist
//        );
//     } 
//     else if (userType === 'Service Provider') {
//        // Logic from updateServiceProviderProfile
//        const updateData = {
//           ...profileData,
//           features: Array.isArray(profileData.features) ? profileData.features : [],
//           images: Array.isArray(profileData.images) ? profileData.images : [],
//           // ... mapping timings ...
//           updatedAt: new Date()
//        };

//        await ServiceProvider.findOneAndUpdate(
//          { userId: new mongoose.Types.ObjectId(userId) },
//          updateData,
//          { new: true, upsert: true }
//        );
//     }

//     res.status(200).json({ success: true, message: "Profile completed" });

//   } catch (error) {
//     console.error("Complete Profile Error:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// };