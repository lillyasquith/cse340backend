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

//Get inventory for AJAX Route, select inv item activity for classification List
router.get("/getInventory/:classification_id", 
utilities.checkManagement,
utilities.handleErrors(invController.getInventoryJSON))

// Route to add classification view
router.get("/add-classification", 
utilities.checkManagement,
utilities.handleErrors(invController.BuilNewClassifiation));

// Process classification
router.post("/add-classification", 
utilities.checkManagement,
// invValidate.classificationRules(), 
// invValidate.checkInvData,
utilities.handleErrors(invController.registerNewClassification))


// Route to add a new vehicle inventory view
router.get("/add-inventory", 
utilities.checkManagement,
utilities.handleErrors(invController.BuildNewVehicle));

// Process add new vehicle inventory
router.post("/add-inventory", 
// invValidate.vehicleRules(), 
// invValidate.checkInvData, 
utilities.checkManagement,
utilities.handleErrors(invController.registerNewVehicle))

// Route to edit
router.get("/edit/:inv_id", 
utilities.checkManagement,
utilities.handleErrors(invController.BuildEditInventory));
//Process edit to update
router.post("/edit-inventory", 
utilities.checkManagement,
utilities.handleErrors(invController.UpdateEditInventory))

// Route to delete
router.get("/delete/:inv_id", 
utilities.checkManagement,
utilities.handleErrors(invController.BuildDeleteInventory));

//Process detele to update
router.post("/delete-inventory", 
utilities.checkManagement,
utilities.handleErrors(invController.UpdateDeleteInventory))



module.exports = router;