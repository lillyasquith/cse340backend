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
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/vehicle-management", {
    title: "Vehicle Management",
    nav,
    errors: null,
    classificationSelect,
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
    errors: null,
  })
};
  
/* ****************************************
*  Deliver New Vehicle
* *************************************** */
invCont.BuildNewVehicle = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Vehicle",
    nav,
    classificationSelect,
    errors: null,
  })
};

/* ****************************************
*  Process new vehicle Inventory
* *************************************** */
invCont.registerNewVehicle = async (req, res) => {
  let nav = await utilities.getNav()
  const {classification_name, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body

  const regResult = await invModel.registerNewVehicle(
    classification_name, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  )
  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("inventory/vehicle-management", {
      title: "",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  }
}
/* ****************************************
*  Process new new classification
* *************************************** */
invCont.registerNewClassification = async (req, res) =>{
  let nav = await utilities.getNav()
  const {classification_name} = req.body
  const regResult = await invModel.registerNewClassification(
    classification_name
  )
  if (regResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was sucessfully added.`
    )
    res.status(201).render("inventory/vehicle-management", {
      title: "Vehicle Management",
      nav,
    })
    // ? how to add new classification_name to getNav
    return utilities.getNav()
  } else {
    req.flash("notice", "Sorry, the adding classification failed.")
    res.status(501).render("inventory/add-classification", {
      title: "Classification",
      nav,
      errors: null,
    })
  }
}
  
/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


module.exports = invCont;