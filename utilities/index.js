const invModel = require("../models/inventory-model");
const jwt = require("jsonwebtoken")
require("dotenv").config()
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
      '<a href="../../inv/detail/' + vehicle.inv_id
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'

      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid +=  
      '<a href="../../inv/detail/' + vehicle.inv_id
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
      grid += '<li>'
      grid += '<img class="imageBox" src="' + vehicle[0].inv_thumbnail 
      +'" alt="Image of '+ vehicle[0].inv_make + ' ' + vehicle[0].inv_model 
      +' on CSE Motors" />'
      grid += '</li>'
      
      grid += '<li>'
      grid += '<div class="single-item-details">'
      grid += '<h3 class="this-title">' + (vehicle[0].inv_make + ' ' + vehicle[0].inv_model) + ' ' +'Details</h3>'
      grid += 
      '<h4 class="price"><strong>Price:</strong> $' + new Intl.NumberFormat('en-US').format(vehicle[0].inv_price) + '</h4>'
      grid += '<p class="description"><strong>Description:</strong> '+ (vehicle[0].inv_description) + '</p>'
      grid += '<p class="color" ><strong>Color:</strong> '+ (vehicle[0].inv_color) + '</p>'
      grid += '<p class="miles"><strong>Miles:</strong> '+ new Intl.NumberFormat('en-US').format(vehicle[0].inv_miles) + '</p>'
      grid += '</div>'
      grid += '</li>'
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}


/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
}

/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
}

// middleware that makes use of the JWT token and checks the account type
Util.checkManagement = (req, res, next) => {
  if (req.locals.accountData && (req.locals.accountData.account_type === "Admin" || req.locals.accountData.account_type === "Employee")) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    res.redirect("/account/login");
  }
};



module.exports = Util;

