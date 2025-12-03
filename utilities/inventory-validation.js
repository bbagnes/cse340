
const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

/*  **********************************
  *  New Classification Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
     // calssification name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Classification Name must use a minimum of 3 characters, alphabtic only."), // on error this message is sent.
  ]
};

  /*  **********************************
*  New Vehicle Registration Validation Rules
* ********************************* */
validate.newVehicleRules = () => {
  return [
      
     //model is required and must be a string
    body("classification_id")
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please select a classification."),

      // model is required and must be a string
      body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Model name must use alphanumeric characters and be at least 3 characters in Length."), // on error this message is sent.
  
      // Make is required and must be string
      body("inv_make")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Vehicle Make must use alphanumeric characters and be at least 3 characters in Length."), // on error this message is sent.
  
      // A vehicle description is required and must be a string
      body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({min: 1})
      .withMessage("A vehicle description is required."),

      // Make is required and must be string
      body("inv_price")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("A Sell Price is required."), // on error this message is sent.

      // Make is required and must be string
      body("inv_year")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({min: 1800,max: 2350 })
        .withMessage("Please provide a four digit Vehicle Year."), // on error this message is sent.
      
        // Make is required and must be string
      body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isNumeric()
        .isLength({ min: 1})
        .withMessage("Please provide the vehicle mileage."), // on error this message is sent.

      // Make is required and must be string
      body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide the vehicle color."), // on error this message is sent.
    ]
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkNewClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  console.log(`This is the body: ${req.body}`);
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addClassfication", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    })
    return
  }
  console.log("Data Check, Check Sat.")
  next()
};

/* *****************************************************
 * Check New Vehicle data and return errors or register
 * ************************************************** */
validate.checkNewVehicleData = async (req, res, next) => {
  const { classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/addvehicle", {
      errors,
      title: "Add New Vehicle",
      nav,
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color
    })
    return
  }
  console.log("Data Check, Check Sat.")
  next()
};

/* ********************************************************************
 * Check Updated Vehicle data and return errors to Edit View or update
 * ****************************************************************** */
validate.checkUpdateData = async (req, res, next) => {
  const itemName = `${inv_make} ${inv_model}`
  const { inv_id, classification_id, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/editvehicle", {
      errors,
      title: "Edit " + itemName,
      nav,
      inv_id, 
      classification_id, 
      inv_make, 
      inv_model, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_year, 
      inv_miles, 
      inv_color
    });
    return
  }
  next()
};

module.exports = validate