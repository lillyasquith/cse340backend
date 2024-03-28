const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities" );
const regValidate = require("../utilities/account-validation")


// Route to add classification
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

//Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

//Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  "/register", 
  regValidate.registrationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount)
)
// Process Login
router.post(
  "/login", 
  regValidate.loginRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.accountLogin)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)
// Process the registration attempt
router.post(
  "/register",
  (req, res) => {
    res.status(200).send('login process')
  }
)

module.exports = router;