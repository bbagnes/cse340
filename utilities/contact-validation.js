const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const contactModel = require("../models/contact-model");

/*  **********************************
  *  Contact Message Validation Rules
  * ********************************* */
  validate.contactMessageRules = () => {
    return [
      // firstname is required and must be string
      body("contact_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a first name; minimum of 3 characters in length."), // on error this message is sent.
  
      // lastname is required and must be string
      body("contact_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a last name; minimum of 3 characters in length."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("contact_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail() // refer to validator.js docs
        .withMessage("A valid email is required."),
       // A Message Type is required
        body("message_content")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please select a valid Message Type."), // on error this message is sent. 
      // Message Content is required and must be string
      body("message_content")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide more information."), // on error this message is sent.
    ]
},

/* ********************************************************************
 * Check Message Content and return errors or continue to registration
 * ****************************************************************** */
validate.checkMessageData = async (req, res, next) => {
  const { contact_firstname, contact_lastname, contact_email, message_type, message_content } = req.body
  let errors = []
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("contact/", {
      errors,
      title: "Contact Us",
      nav,
      contact_firstname,
      contact_lastname,
      contact_email,
      message_type,
      message_content
    })
    return
  }
  next()
};


  module.exports = validate;