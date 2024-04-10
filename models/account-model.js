const pool = require("../database/");


/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}


/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

// A function to get account information based on the account_id.
async function getAccountByAccounId (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}
// A function to handle the update of the account information as submitted to the controller from the account update form. It will only need to update the firstname, 
// lastname and email values based on the account_id.
async function UpdateEditAccount(
  account_id, 
  account_firstname, 
  account_lastname, 
  account_email
) {
  try {
    const sql =
      "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3, WHERE account_id= $4 RETURNING *"
    const data = await pool.query(sql, [
      account_id, 
      account_firstname, 
      account_lastname, 
      account_email
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

// A third function to update the password (as a hash), based on the account_id. 
// Be sure that after submitting the new password to check the account table to make sure the password is a hash as part of your testing.
async function UpdateEditPassword(
  account_id, 
  account_password
) {
  try {
    const sql =
      "UPDATE public.account SET account_password = $1, WHERE account_id= $2 RETURNING *"
    const data = await pool.query(sql, [
      account_id, 
      account_password
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}
module.exports = {
  registerAccount, 
  checkExistingEmail, 
  getAccountByEmail, 
  getAccountByAccounId, 
  UpdateEditAccount,
  UpdateEditPassword};

