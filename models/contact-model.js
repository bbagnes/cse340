const pool = require("../database/index.js")

/* **************************************
*   Insert Contact Message into database
* ************************************* */
async function addContactMessage(
  contact_firstname, 
  contact_lastname, 
  contact_email, 
  message_type, 
  message_content,
  message_access,
  message_status
  ){    
  try {
    const sql = "INSERT INTO public.contact (contact_firstname, contact_lastname, contact_email, message_type, message_content, message_access, message_status ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *"
    const data = await pool.query(sql, [
      contact_firstname, 
      contact_lastname, 
      contact_email, 
      message_type, 
      message_content, 
      message_access,
      message_status
    ]);
    console.log(data.rows[0]);
    return data.rows[0];
  } catch (error) {
    return error.message;
  }
};

/* **************************************
*   Insert Contact Message into database
* ************************************* */
async function reviewMessages(account_type){    
  try {
    if (account_type === "Admin") {
    const data = await pool.query(
      `SELECT * FROM public.contact
       WHERE message_status = 'pending'
       LIMIT 10`,
    )
    return data.rows;
  } else {
    const data = await pool.query(
      `SELECT * FROM public.contact
       WHERE message_status = 'pending' AND message_access = 'Employee'
       LIMIT 10`,
    )
    // console.table(data.rows);
    return data.rows
  }
  } catch (error) {
    console.error("reviewMessages error: " + error)
    return error.message;
  }
};

module.exports = { addContactMessage, reviewMessages };