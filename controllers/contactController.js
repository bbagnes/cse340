const contactModel = require("../models/contact-model")
const utilities = require("../utilities/")

const contCont = {}

/* ***************************
 *  Build Contact Us view
 * ************************** */
contCont.buildContactView = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./contact/", {
    title: "Contact Us", nav, errors: null,
  });
};

/* ****************************************
*  Add Contact Message to Database
* *************************************** */
contCont.addContactMessage = async function (req, res) {
  let nav = await utilities.getNav() 
  let message_access = "";
  let message_status = "pending";
  let { 
    contact_firstname, 
    contact_lastname, 
    contact_email, 
    message_type, 
    message_content} = req.body;
    console.log(message_type);

  if (message_type == "question") {
      message_access = "Employee";
  } else {
    message_access = "Admin";
  }    

  const commentResult = await contactModel.addContactMessage(
    contact_firstname, 
    contact_lastname, 
    contact_email, 
    message_type,
    message_content, 
    message_access,
    message_status    
  )

  if (commentResult) { 
    console.log(commentResult);
    req.flash(
      "notice",
      `Thank you ${commentResult.contact_firstname}, your message has been received.<br> Typical response time is 3-5 business days.`);
    res.redirect("/");
  } else {
    req.flash("notice", "Sorry, your message failed to process, please try again.");
    res.status(501).render("./contact/", {
    title: "Contact Us", nav, errors: null,
    });
  }
}

/* ***************************
 *  Build Review Messages View
 * ************************** */
contCont.reviewMessages = async function (req, res, next) {
  const account_type = (req.params.account_type); 
  console.log('This is authorized value: ' + account_type);
  const data = await contactModel.reviewMessages(account_type);
  console.table(data);
  const messageGrid = await utilities.buildMessageGrid(data);
  let nav = await utilities.getNav();
  res.render("./contact/reviewmessages", {
    title: "Reiew Messages", nav, messageGrid, errors: null
  });
}

/* ***************************
 *  Process Resolve Messages 
 * ************************** */
contCont.resolveMessage = async function (req, res, next) {
  const account_type = (req.params.account_type); 
  console.log('This is authorized value: ' + account_type);
  const data = await contactModel.reviewMessages(account_type);
  // console.table(data);
  let messageGrid = await utilities.buildMessageGrid(data);
  const nav = await utilities.getNav();
  res.render("./contact/reviewmessages", {
    title: "Review Messages", nav, errors: null, messageGrid,
  });
}


module.exports = contCont;