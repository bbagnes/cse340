const utilities = require("../utilities/");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
*  Deliver Account view
* *************************************** */
async function buildAccountView(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/", {
    title: "Manage Account",
    nav,
    errors: null,
  });
};

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
};

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegistrationView(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
};

/* ****************************************
*  Deliver Update/Edit Account view
* *************************************** */
async function editAccountView(req, res, next) {
    const accountId = parseInt(req.params.account_id);
    utilities.checkAuthorization
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(accountId);
    res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id
    });
  };

/* ****************************************
*  Process Account Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
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
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    });
  }
};

/* ****************************************
 *  Process login request
 * ************************************** */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(accountData, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: 3600 * 1000 });
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 });
      }
      return res.redirect("/account/")
    }else {
      req.flash("message notice", "Please check your credentials and try again.");
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      });
    }
  } catch (error) {
    throw new Error('Access Forbidden')
  }
};

/* ****************************************
*  Process Account Update
* *************************************** */
async function updateAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_id } = req.body

  const editResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  );

  if (editResult) {
    // Rebuild the JWT with new data
    delete editResult.account_password;
    const accessToken = jwt.sign(editResult, 
      process.env.ACCESS_TOKEN_SECRET, {expiresIn: 3600 * 1000,});
    res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
    req.flash(
      "notice",
      `Congratulations, ${editResult.account_firstname} you\'re account has been sucessfully updated.`
    )
    res.status(201).render("account/", {
      title: "Manage Account",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the Update failed.")
    const accountData = await accountModel.getAccountById(account_id);
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id
    });
  }
};

/* *************************
 *  Process Password Change
 * *********************** */
async function changePassword(req, res) {
  let nav = await utilities.getNav()
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error changing the password.')
    const accountData = await accountModel.getAccountById(account_id);
    res.render("./account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id
    });
  }

  const regResult = await accountModel.changePassword(
    hashedPassword,
    account_id
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re Password has been sucessfully changed.`
    )
    res.status(201).render("account/", {
      title: "Manage Account",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the Password Update failed.")
    const accountData = await accountModel.getAccountById(account_id);
    res.status(501).render("account/update", {
      title: "Update Account",
      nav,
      errors,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email,
      account_id: accountData.account_id
    });
  }
};

/* ****************************************
 *  Process logout request
 * ************************************** */
async function accountLogout(req, res) {
if (req.cookies.jwt) {
  res.clearCookie("jwt");
  res.locals.loggedin = "";     
  return res.redirect("/");
  }
};

module.exports = { 
  buildLogin, 
  buildRegistrationView, 
  registerAccount, 
  accountLogin, 
  buildAccountView, 
  editAccountView,
  updateAccount,
  accountLogout,
  changePassword
};