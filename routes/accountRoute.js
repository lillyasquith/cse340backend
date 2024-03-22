const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities" );

//Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//Process Registration
router.post("/register", utilities.handleErrors(accountController.registerAccount))

module.exports = router;