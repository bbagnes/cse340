const express = require("express");
const router = new express.Router();
const contactController = require("../controllers/contactController");
const utilities = require("../utilities/");
const contactValidate = require("../utilities/contact-validation");

// Route to get Contact View.
router.get("/", utilities.handleErrors(contactController.buildContactView));

// Route to add a contact message to db.
router.post("/sendMessage", utilities.handleErrors(contactController.addContactMessage));

// Route to view Review Messages View.
router.get("/messages/:account_type",
    utilities.checkAuthorization,
    utilities.handleErrors(contactController.reviewMessages));

// Route to Resolve Messages
router.get("/resolveMessage", 
    utilities.checkAuthorization, // Verify users is authorized to access this page.
    utilities.handleErrors(contactController.resolveMessage));

module.exports = router;