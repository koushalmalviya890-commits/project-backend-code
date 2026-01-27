// src/models/Sectors.ts
//import mongoose from "mongoose";

const mongoose = require("mongoose");

const sectorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports =
  mongoose.models.Sector || mongoose.model("Sector", sectorSchema);




  //module.exports = mongoose.models.ServiceProvider || mongoose.model('Service Provider', serviceProviderSchema, 'Service Provider');