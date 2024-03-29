// Needed Resources 
const express = require("express");
const router = new express.Router(); 
const invController = require("../controllers/invController");
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId",utilities.handleErrors(invController.buildByClassificationId) );

// Route to build inventory by classification view
router.get("/detail/:itemId", utilities.handleErrors(invController.buildByItemId));

// Route to add classification
router.get("/", utilities.handleErrors(invController.BuildManagementPage));

// Route to add classification
router.get("/add-classification", utilities.handleErrors(invController.AddNewClassifiation));

module.exports = router;