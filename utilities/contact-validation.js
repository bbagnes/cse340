const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
  const contactModel = require("../models/contact-model");

/*  **********************************
  *  Registration Data Validation Rules
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
        .withMessage("A valid email is required.")
    ]
},

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.changePasswordRules = () => {
    return [
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  };

  module.exports = validate;