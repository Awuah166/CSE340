// Needed reesources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require("../utilities/account-validation")

// Route to build login view 
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister))

//Route to build account management view (default view)
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement))

// Route to build account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateAccount))

// Route to logout
router.get("/logout", utilities.handleErrors(accountController.logout))

// Route to handle registration form submission
router.post(
    "/register", 
    regValidate.registrationRules(), // Apply registration validation rules
    regValidate.checkRegData, // Check registration data and handle errors
    utilities.handleErrors(accountController.registerAccount))

/*************
 * Process the login attempt
 * *************/   
router.post(
    "/login",
    regValidate.loginRules(), // Apply login validation rules
    regValidate.checkLoginData, // Check login data and handle errors
    utilities.handleErrors(accountController.accountLogin)
)

// Route to process account update
router.post(
    "/update",
    regValidate.updateAccountRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateAccount)
)

// Route to process password change
router.post(
    "/change-password",
    regValidate.changePasswordRules(),
    regValidate.checkChangePasswordData,
    utilities.handleErrors(accountController.changePassword)
)

module.exports = router
