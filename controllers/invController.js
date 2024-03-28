const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};


/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
};


/* ***************************
 *  Build inventory by item view
 * ************************** */

invCont.buildByItemId = async function (req, res, next) {
  const itemId = req.params.itemId
  const data = await invModel.getInventoryByItemId(itemId)
  const grid = await utilities.buildItemGrid(data)
  let nav = await utilities.getNav()
  const itemName = `${data[0].inv_year} ${data[0].inv_make} ${data[0].inv_model}`
  res.render("./inventory/item", {
    title: itemName,
    nav,
    grid,
  })
};

/* ****************************************
*  Deliver Vehicle Management View
* *************************************** */
invCont.BuildManagementPage = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle-management", {
    title: "Vehicle Management",
    nav,
  })
};

/* ****************************************
*  Deliver New Classification
* *************************************** */
invCont.BuilNewClassifiation = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classifiation",
    nav,
  })
};
  
/* ****************************************
*  Deliver New Vehicle
* *************************************** */
invCont.BuildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
  })
};
  

module.exports = invCont;