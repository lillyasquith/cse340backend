const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities" );
const regValidate = require("../utilities/account-validation")

//Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Process Registration
router.post("/register", utilities.handleErrors(accountController.registerAccount))

// Process the registration data
router.post("/register", regValidate.registationRules(), regValidate.checkRegData, utilities.handleErrors(accountController.registerAccount))

module.exports = router;