const express = require("express");
const router = new express.Router(); 
const accountController = require("../controllers/accountController");
const utilities = require("../utilities" );
const regValidate = require("../utilities/account-validation")


// Route to add classification
router.get("/", utilities.handleErrors(accountController.buildAccountManagement));

//Deliver Login View
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process Login
router.post(
  "/login", 
  regValidate.loginRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.accountLogin)
)

//Deliver Registration View
router.get("/register", utilities.handleErrors(accountController.buildRegister))

// Process registration
router.post(
  "/register", 
  regValidate.registrationRules(), 
  regValidate.checkRegData, 
  utilities.handleErrors(accountController.registerAccount)
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

// Route to edit
router.get("/edit/:account_id", 
utilities.handleErrors(accountController.BuildEditAccount));

//Process edit to update 1st form
router.post("/edit-account", 
regValidate.editRules(), 
regValidate.checkRegData, 
utilities.handleErrors(accountController.UpdateEditPassword),
utilities.handleErrors(accountController.UpdateEditAccount));

// //Process edit to update 2st form
// router.post("/", 
// regValidate.editRules(), 
// regValidate.checkRegData, 
// utilities.handleErrors(accountController.UpdateEditPasswordAccount));

// To logout
router.get("/logout", utilities.handleErrors(accountController.accountLogout))

module.exports = router;