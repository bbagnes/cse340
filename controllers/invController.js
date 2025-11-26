const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId;
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
}

/* ***************************
 *  Build vehicle view
 * ************************** */
invCont.buildVehicleView = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId;
  const vehicle = await invModel.getInventoryByVehicleId(vehicle_id);
  const grid = await utilities.buildVehicleGrid(vehicle);
  let nav = await utilities.getNav();
  const vehicleTitle = vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model;
  res.render("./inventory/vehicle", {
    title: vehicleTitle, nav, grid,
  });
}

/* *********************************
 *  Build Inventory Management view
 * ******************************* */
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()
  const vehicleTitle = "Manage Inventory";
  res.render("./inventory/invmanagement", {
    title: vehicleTitle, nav, classificationSelect,
  });
}

/* ***************************
 *  Build Add New Classification view
 * ************************** */
invCont.buildNewClassificationView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const vehicleTitle = "Add New Classification";
  res.render("./inventory/addclassification", {
    title: vehicleTitle, nav, errors: null,
  });
}

/* ***************************
 *  Build Add New Vehicle view
 * ************************** */
invCont.addNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav();
  const vehicleTitle = "Add New Vehicle";
  res.render("./inventory/addvehicle", {
    title: vehicleTitle, nav, errors: null,
  });
}

/* ****************************************
*  Process new vehicle Registration
* *************************************** */
invCont.registerNewVehicle = async function (req, res) {
  let nav = await utilities.getNav()
  const { } = req.body
  const regResult = await invModel.registerNewVehicle(
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
  )  

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the ${inv_make} ${inv_model} was sucessfully added.`
    )
    res.status(201).render("/inventory/management", {
      title: "Vehicle Management", nav, errors: null, })
  } else {
    req.flash("notice", "Sorry, the vehicle registration failed.")
    res.status(501).render("inventory/addvehicle", {
      title: "Add New Vehicle", nav, errors: null, })
  }
}

/* *********************************************************************
 *  Generate Server Error, access a value that cannot exist in Database
 * *****************************************************************&* */
invCont.serverError = async function (req, res, next) {
  const vehicle_id = 0;
  const vehicle = await invModel.getInventoryByVehicleId(vehicle_id);
  const grid = await utilities.buildVehicleGrid(vehicle);
  let nav = await utilities.getNav();
  const vehicleTitle = vehicle.inv_year + " " + vehicle.inv_make + " " + vehicle.inv_model;
  res.render("./inventory/vehicle", {
    title: vehicleTitle, nav, grid,
  });
}

/* ********************************************
 *  Return Inventory by Classification As JSON
 * ****************************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont;