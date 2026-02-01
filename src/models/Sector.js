// src/models/Sectors.ts
const mongoose = require("mongoose");


const { Schema } = mongoose

const sectorSchema = new Schema({
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

const Sector =
  mongoose.models.Sector || mongoose.model("Sector", sectorSchema);

module.exports = Sector;
