const express = require("express");
const router = new express.Router();
const accountController = require("../controllers/accountController");
const utilities = require("../utilities/");
const acctValidate = require("../utilities/account-validation");

// Route to Account View.
router.get("/", 
  utilities.checkLogin,
   utilities.handleErrors(accountController.buildAccountView));

// Route to build inventory by classification view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to build account registration view
router.get("/register", utilities.handleErrors(accountController.buildRegistrationView));

// Route to process registration data
router.post(
    '/register',
    acctValidate.registationRules(),
    acctValidate.checkRegData,    
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
  "/login",
  acctValidate.loginRules(),
  acctValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Edit Account information view
router.get("/update/:account_id", utilities.handleErrors(accountController.editAccountView));

// Update Account: name or email
router.post("/update/", 
  acctValidate.UpdateAccountRules(),
  acctValidate.checkUpdateData,
  utilities.handleErrors(accountController.updateAccount));

  router.post("/changepassword",
    acctValidate.changePasswordRules(),
    acctValidate.checkPasswordChangeData,
    utilities.handleErrors(accountController.changePassword));

// Logout out of server, redirect to Home View
router.get("/logout", utilities.handleErrors(accountController.accountLogout));

module.exports = router;