const pool = require("../database/index.js")

/* **************************************
*   Insert Contact Message into database
* ************************************* */
async function addContactMessage(contact_firstname, contact_lastname, contact_email, contact_message){
  try {
    const sql = "INSERT INTO contact (contact_firstname, contact_lastname, contact_email, contact_message) VALUES ($1, $2, $3, $4) RETURNING *"
    const data = await pool.query(sql, [contact_firstname, contact_lastname, contact_email, contact_message]);
    return data.rows[0];
  } catch (error) {
    return error.message
  }
};

module.exports = { addContactMessage };