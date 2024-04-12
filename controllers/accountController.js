const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Log In",
      nav,
    })
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      title: "Register",
      nav,
      errors:null,
    })
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildAccountManagement(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/account-management", {
    title: "Account Management",
    nav,
    errors:null,
  })
};

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { 
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password 
    } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
      // regular password and cost (salt is generated automatically)
      hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
      req.flash("notice", "Sorry, there was an error processing the registration.")
      res.status(500).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }

    const regResult = await accountModel.registerAccount(
      account_firstname,
      account_lastname,
      account_email,
      hashedPassword
    )
  
    if (regResult) {
      req.flash(
        "notice",
        `Congratulations, you\'re registered ${account_firstname}. Please log in.`
      )
      res.status(201).render("account/login", {
        title: "Login",
        nav,
      })
    } else {
      req.flash("notice", "Sorry, the registration failed.")
      res.status(501).render("account/register", {
        title: "Registration",
        nav,
        errors: null,
      })
    }
};

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 })
   if(process.env.NODE_ENV === 'development') {
     res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
     } else {
       res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
     }
   return res.redirect("/account/")
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
}

/* ***************************
 *  Build Edit Account view
 * ************************** */
async function BuildEditAccount (req, res) {
  //console.log(`line 131 ${req.body}`)
  let nav = await utilities.getNav()
  const account_id = parseInt(req.params.account_id)
  const data = await accountModel.getAccountById(account_id)
  const accountData = data
  res.render("./account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id: accountData.account_id,
    account_firstname: accountData.account_firstname,
    account_lastname:accountData.account_lastname,
    account_email:accountData.account_email
  })
}

/* ***************************
 *  Update Edit Account Data
 * ************************** */
async function UpdateEditAccount (req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_firstname,
    account_lastname,
    account_email
  } = req.body
  const updateEditResult = await accountModel.UpdateEditAccount(
    parseInt(account_id),
    account_firstname,
    account_lastname,
    account_email
  )

  if (updateEditResult) {
    req.flash("notice", "Congratulations, your account information has been updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_firstname,
    account_lastname,
    account_email
    })
  }
}

/* ***************************
 *  Update Edit Account Data
 * ************************** */
async function UpdateEditPassword (req, res) {
  let nav = await utilities.getNav()
  const {
    account_id,
    account_password
  } = req.body
  const updateEditPassword = await accountModel.UpdateEditPassword(
    parseInt(account_id),
    account_password
  )

  if (updateEditPassword) {
    req.flash("notice", "Congratulations, your new password has been updated.")
    res.redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("account/edit-account", {
    title: "Edit Account",
    nav,
    errors: null,
    account_id,
    account_password
    })
  }
}
/* ***************************
 *  Process Log out
 * ************************** */
async function accountLogout(req, res) {
res. clearCookie("jwt")
const nav = await utilities.getNav()
delete res.locals.accountData;
res.locals.loggedin = undefined;
req.flash("notice", "Logout successful.")
res.render("index", {
  title: "Home",
  nav
});
return;
}

module.exports = { 
  buildLogin, 
  buildRegister, 
  registerAccount, 
  accountLogin, 
  buildAccountManagement, 
  BuildEditAccount, 
  UpdateEditAccount, 
  UpdateEditPassword,
  accountLogout
};