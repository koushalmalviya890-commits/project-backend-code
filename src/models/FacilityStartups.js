const mongoose = require('mongoose');

const FacilityStartupsSchema = new mongoose.Schema({
  startupId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Startup'
  },
  incubatorId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true,
  collection: 'FacilityStartups' // Forces exact collection name
});

// Check if model exists before defining to prevent overwrite errors in some environments
module.exports = mongoose.models.FacilityStartups || mongoose.model('FacilityStartups', FacilityStartupsSchema);
