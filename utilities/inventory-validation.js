const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

// const invModel = require("../models/inventory-model");
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name
    })
    return
  }
  next()
}


/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.classificationRules = () => {
  return [
    // classification_name is required and must be string
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a classification_name."), // on error this message is sent.
  ]
}

validate.vehicleRules = () => {
  return [
  // valid classification_name is required and cannot already exist in the DB
  body("classification_name")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid classification_name is required."),
  
  body("inv_make")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_make is required."),

  body("inv_model")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_model is required."),

  body("inv_year")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_year is required."),
  
  body("inv_description")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_description is required."),

  body("inv_image")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_image is required."),

  body("inv_thumbnail")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_thumbnail is required."),

  body("inv_price")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_price is required."),

  body("inv_miles")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_miles is required."),

  body("inv_color")
  .trim()
  .escape()
  .notEmpty()
  .isEmail()
  .normalizeEmail() // refer to validator.js docs
  .withMessage("A valid inv_color is required."),

  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const { 
    classification_name, 
    inv_make, 
    inv_model, 
    inv_year, 
    inv_description, 
    inv_image, 
    inv_thumbnail, 
    inv_price, 
    inv_miles, 
    inv_color } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("./inventory/vehicle-management", {
      errors,
      title: "Vehicle Management",
      nav,
      classification_name, 
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color
    })
    return
  }
  next()
}

  
module.exports = validate;