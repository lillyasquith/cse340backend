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
  const classification_id = req.params.classificationId
  const itemId = req.params.itemId*1 //to interger
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const findObjectbyItemId = (arr, invId) =>{
      return arr.find (obj => obj.inv_id === invId);
  };
  const foundItem = findObjectbyItemId(data, itemId);
  console.log(foundItem)
  const grid = await utilities.buildItemGrid(foundItem)
  let nav = await utilities.getNav()
  const itemName = `${foundItem.inv_year} ${foundItem.inv_make} ${foundItem.inv_model}`
  res.render("./inventory/item", {
    title: itemName,
    nav,
    grid,
  })
};

module.exports = invCont;