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

module.exports = contCont;