//import express from "express";
//import { getSectors, createSector } from "../controllers/sector.controller.js";

const express = require("express");
const {getSectors, createSector} = require("../controllers/SectorController");

const router = express.Router();

router.get("/", getSectors);
router.post("/", createSector);

module.exports = router;
