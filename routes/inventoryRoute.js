// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities/");
const invValidate = require("../utilities/inventory-validation")

// Route to build inventory by classification view
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId) );

// Route to build inventory by classification view
router.get("/detail/:itemId", utilities.handleErrors(invController.buildByItemId));

// Route to add managament view
router.get("/", utilities.handleErrors(invController.BuildManagementPage));

// Route to add classification view
router.get("/add-classification", utilities.handleErrors(invController.BuilNewClassifiation));

// Process classification
router.post("/add-classification", 
invValidate.classificationRules(), 
invValidate.checkClassificationData, 
utilities.handleErrors(invController.registerNewClassification))


// Route to add a new vehicle inventory view
router.get("/add-inventory", utilities.handleErrors(invController.BuildNewVehicle));

// Process add new vehicle inventory
router.post("/add-inventory", 
invValidate.vehicleRules(), 
invValidate.checkInvData, 
utilities.handleErrors(invController.registerNewVehicle))


// Route to edit
router.get("/edit/:itemId", utilities.handleErrors(invController.BuildEditInventory));
//Process edit to update
router.post("/edit-inventory", utilities.handleErrors(invController.UpdateInventory))

//Get inventory for AJAX Route
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

module.exports = router;