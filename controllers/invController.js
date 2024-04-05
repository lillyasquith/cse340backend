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
*  Process new new classification
* *************************************** */
invCont.registerNewClassification = async (req, res) =>{
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  const {classification_name} = req.body
  
  const regResult = await invModel.registerNewClassification(classification_name)
  if (regResult) {
    req.flash(
      "notice",
      `The ${classification_name} classification was sucessfully added.`
    )
    res.status(201).render("./inventory/vehicle-management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the adding classification failed.")
    res.status(501).render("./inventory/add-classification", {
      title: "Classification",
      nav,
      classificationSelect,
      errors: null,
    })
  }
}


  
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
  const itemId = req.params.itemId
  const data = await invModel.getInventoryByItemId(itemId)
  const classificationSelect = await utilities.buildClassificationList(data.itemId)
  // const classificationSelect = await utilities.buildClassificationList()
  const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body

  const regResult = await invModel.registerNewVehicle(
    classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color
  )
  if (regResult) {
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully added.`
    )
    res.status(201).render("./inventory/vehicle-management", {
      title: "",
      nav,
      classificationSelect, 
      errors: null,
    
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./inventory/vehicle-management", {
      title: "Vehicle Management",
      nav,
      classificationSelect,
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

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.BuildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByItemId(inv_id)
  const itemData = data[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Edit Inventory Data
 * ************************** */
invCont.UpdateEditInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body
  const updateResult = await invModel.UpdateEditInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    classification_id
    })
  }
}

/* ***************************
 *  Build Detele inventory view
 * ************************** */
invCont.BuildDeleteInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByItemId(inv_id)
  const itemData = data[0]
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
    classification_id: itemData.classification_id
  })
}

/* ***************************
 *  Update Edit Inventory Data
 * ************************** */
invCont.UpdateDeleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    classification_id,
  } = req.body
  const deleteResult = await invModel.UpdateDeleteInventory(
    parseInt(inv_id),  
    inv_make,
    inv_model,
    inv_price,
    inv_year,
    classification_id
  )

  if (deleteResult) {
    const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the deletion failed.")
    res.status(501).render("inventory/delete-inventory", {
    title: "Delete " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
    classification_id
    })
  }
}

module.exports = invCont;