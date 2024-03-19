const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const itemCont = {};

/* ***************************
 *  Build inventory by item view
 * ************************** */
itemCont.buildByClassificationId = async function (req, res, next) {
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
  

module.exports = itemCont;