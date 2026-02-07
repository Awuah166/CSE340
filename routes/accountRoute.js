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

// Route to handle registration form submission
router.post(
    "/register", 
    regValidate.registrationRules(), // Apply registration validation rules
    regValidate.checkRegData, // Check registration data and handle errors
    utilities.handleErrors(accountController.registerAccount))

module.exports = router
