const express = require("express");
const router = new express.Router();
const contactController = require("../controllers/contactController");
const utilities = require("../utilities/");
const contactValidate = require("../utilities/contact-validation");

// Route to get Contact View.
router.get("/", utilities.handleErrors(contactController.buildContactView));

module.exports = router;