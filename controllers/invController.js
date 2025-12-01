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
  const classificationSelect = await utilities.buildClassificationList();
  const vehicleTitle = "Vehicle Management";
  res.render("./inventory/invmanagement", {
    title: vehicleTitle, nav, errors: null, classificationSelect,
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
invCont.buildNewVehicleView = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const vehicleTitle = "Add New Vehicle";
  res.render("./inventory/addvehicle", {
    title: vehicleTitle, classificationSelect, nav, errors: null,
  });
}

/* ****************************************
*  Process new classification Registration
* *************************************** */
invCont.addNewClassification = async function (req, res) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const { } = req.body
  const regResult = await invModel.addNewClassification(classification_name);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, the ${classification_name} Class was sucessfully added.`
    )
    res.status(201).render("/inventory/invmanagement", {
      title: "Vehicle Management", nav, errors: null, classificationSelect, })
  } else {
    req.flash("notice", "Sorry, the vehicle registration failed.")
    res.status(501).render("inventory/addclassification", {
      title: "Add New Classification", nav, errors: null, })
  }
}

/* ****************************************
*  Process new vehicle Registration
* *************************************** */
invCont.addNewVehicle = async function (req, res) {
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

/* ****************************************
*  Edit Vehicle Detailis in Inventory
* *************************************** */
invCont.editVehicleIDetails = async function (req, res) {
  const invId = parseInt(req.params.invId);
   let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByVehicleId(invId);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/editvehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
}

/* ****************************************
*  Process Update to vehicle data
* *************************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
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
   } = req.body
  const updateResult = await invModel.updateInventory(
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

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/editvehicle", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ****************************************
*  Delete Inventory Item View
* *************************************** */
invCont.deleteinventoryItemView = async function (req, res) {
  const inv_id = parseInt(req.params.inv_id);
   let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryByVehicleId(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/deletevehicle", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  });
}

/* ****************************************
*  Delete selected vehicle from Inventory
* *************************************** */
invCont.deleteInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = parseInt(req.body.inv_id);  
  const itemData = await invModel.getInventoryByVehicleId(inv_id);
  const itemName = itemData.inv_make + " " + itemData.inv_model;
  const deleteResult = await invModel.deleteInventoryItem(inv_id); 

  if (deleteResult) {    
    req.flash("notice", `The ${itemName} was successfully deleted.`)
    res.redirect("/inv/")
  } else {
    req.flash("notice", "Sorry, the deletion failed.");
    res.redirect("/inv/delete/invId");
  }
}

module.exports = invCont;