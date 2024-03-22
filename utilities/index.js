const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
    let data = await invModel.getClassifications()
    //console.log(data)
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
          '<a href="/inv/type/' +
          row.classification_id +
          '" title="See our inventory of ' +
          row.classification_name +
          ' vehicles">' +
          row.classification_name +
          "</a>"
    list += "</li>"
    })
    list += "</ul>"
    return list
};

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach((vehicle) => { 
      grid += '<li>'
      grid +=  
      '<a href="/' + vehicle.classification_id 
      + '/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'

      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid +=  
      '<a href="./' + vehicle.classification_id 
      +'/detail/' + vehicle.inv_id
      +'" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model 
      + ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the item view HTML
* ************************************ */
Util.buildItemGrid = async function(data){
  let itemAmount = [data]
  let vehicle = data
  let grid
  if(itemAmount.length === 1){
    grid = '<ul id="single-item-display">'
      grid += '<div class= "imageBox">'
        grid +=
        '<a  href="../../inv/detail/' + vehicle.inv_id +
        '" title="View ' + vehicle.inv_make + '' + vehicle.inv_model +
        'details"><img src="' + vehicle.inv_thumbnail +
        '" alt="Image of ' + vehicle.inv_make + '' +
        vehicle.inv_model +' on CSE Motors" /></a>';
      grid += '</div>'
      grid += '<li>'
      grid += '<div class="single-item-details">'
      grid += '<h3 class="this-title">' + (vehicle.inv_make + ' ' + vehicle.inv_model) + ' ' +'Details</h3>'
      grid += 
      '<h4 class="price"><strong>$Price:</strong> ' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h4>'
      grid += '<p class="description"><strong>Description:</strong> '+ (vehicle.inv_description) + '</p>'
      grid += '<p class="color" ><strong>Color:</strong> '+ (vehicle.inv_color) + '</p>'
      grid += '<p class="miles"><strong>Miles:</strong> '+ (vehicle.inv_miles) + '</p>'
      grid += '</div>'
      grid += '</li>'
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

// Util.buildLogin = async function (req, res, next){

// }

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;

