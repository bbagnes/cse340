// Needed Resources 
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation");

//Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build vehicle view
router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildVehicleView));

// Route to build the Add New Classification view
router.get("/addClass", utilities.handleErrors(invController.buildNewClassificationView));

// Route to Add a New Classification
router.post("/addClass",
    invValidate.classificationRules,
    invValidate.checkNewClassificationData,
    utilities.handleErrors(invController.addNewClassification));

// Route to build the Add New Vehicle view
router.get("/addVehicle", utilities.handleErrors(invController.addNewVehicle));

// Route to Add a New Vehichle to Inventory
router.post("/addVehicle",
    invValidate.newVehicleRules,
    invValidate.checkNewVehicleData,
    utilities.handleErrors(invController.registerNewVehicle));

// Route to manage inventory items 
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON));

// Route to edit inventory items on Inventory Management page.
router.get("/edit/:invId", utilities.handleErrors(invController.editVehicleIDetails));

// Route to generate Server Error
router.get("/errorTest", utilities.handleErrors(invController.serverError));

// Route to update edits to inventory item
router.post("/update/", 
    invValidate.newVehicleRules,
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory));

// Route to Delete an inventory item
router.get("/delete/:invId", utilities.handleErrors(invController.deleteinventoryItemView));

router.post("/deleteinventory", utilities.handleErrors(invController.deleteInventoryItem));

module.exports = router;