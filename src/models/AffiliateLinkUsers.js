const mongoose = require('mongoose');


const AffiliateLinkUsersSchema = new mongoose.Schema({
  mailId: {
    type: String,
    required: true,
  },
    contactNumber: {
    type: String,
    required: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  affiliateId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.AffiliateLinkUser ||
  mongoose.model('AffiliateLinkUser', AffiliateLinkUsersSchema, 'AffiliateLinkUsers')
