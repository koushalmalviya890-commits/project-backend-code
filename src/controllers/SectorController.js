          //import Sector from "../models/Sector.js";

const Sector = require("../models/Sector.js");

// GET SECTORS
exports.getSectors = async (req, res) => {
  try {
    const sectors = await Sector.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: sectors
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch sectors"
    });
  }
};


// CREATE SECTOR
exports.createSector = async (req, res) => {
  try {
    let { name } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({
        success: false,
        error: "Sector name is required"
      });
    }

    const normalizedName = name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-");

    let sector = await Sector.findOne({ name: normalizedName });

    if (!sector) {
      sector = await Sector.create({
        name: normalizedName,
        isActive: true
      });

    } else if (!sector.isActive) {
      sector.isActive = true;
      await sector.save();
    }

    res.status(201).json({
      success: true,
      data: sector
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      error: "Failed to create sector"
    });
  }
};
