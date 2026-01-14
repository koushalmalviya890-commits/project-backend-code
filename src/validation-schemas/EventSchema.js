/**
 * onlineOrderSuccessSchema
 */
const Joi = require("joi")
   const onlineOrderSuccessSchema = Joi.object({
    razorpay_order_id: Joi.string().trim().max(255).required().messages({
        "string.base": "Razorpay order id should be a type of string",
        "string.empty": "Razorpay order id is not allowed to be empty",
        "string.max": "Razorpay order id should be maximum 500 characters",
        "any.required": "Razorpay order id is a required field",
    }),
    razorpay_payment_id: Joi.string().trim().max(255).required().messages({
        "string.base": "Razorpay payment id should be a type of string",
        "string.empty": "Razorpay payment id is not allowed to be empty",
        "string.max": "Razorpay payment id should be maximum 255 characters",
        "any.required": "Razorpay payment id is a required field",
    }),
    razorpay_signature: Joi.string().trim().max(255).required().messages({
        "string.base": "Razorpay signature should be a type of string",
        "string.empty": "Razorpay signature is not allowed to be empty",
        "string.max": "Razorpay signature should be maximum 255 characters",
        "any.required": "Razorpay signature is a required field",
    }),
});

module.exports = {
      onlineOrderSuccessSchema
}