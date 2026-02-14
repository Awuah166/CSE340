const utilities = require(".") // Requiring the utilities index file to access all utility functions
    const { body, validationResult } = require("express-validator") // Importing express-validator functions for input validation
    const accountModel = require("../models/account-model")
    const validate = {} // Creating an object to hold validation functions

/********************
 * Registration Data Validation Rules
 * ******************/
    validate.registrationRules = () => {
        return [
            // First name is required and must be a string
            body("account_firstname")
                .trim()
                .escape()
                .notEmpty()
                .withMessage("Please provide a first name.")
                .bail()
                .isLength({ min: 1})
                .withMessage("Please provide a first name."), // On error this message is sent

            // Last name is required and must be a string
            body("account_lastname")
                .trim()
                .escape()
                .notEmpty()
                .withMessage("Please provide a last name.")
                .bail()
                .isLength({ min: 2})
                .withMessage("Please provide a last name."), // On error this message is sent

            // Valid email is required and must not already exist in the database
            body("account_email")
                .trim()
                .escape()
                .notEmpty()
                .withMessage("Please provide an email address.")
                .bail()
                .isEmail()
                .withMessage("Please provide a valid email address.")
                .normalizeEmail()// refer to validator.js docs
                .custom(async (account_email) => {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email exists. Please log in or use a different email.")
                    }
                }),

            // Password is required and must meet complexity requirements
            body("account_password")
                .trim()
                .notEmpty()
                .withMessage("Please provide a password.")
                .bail()
                .isStrongPassword({
                    minLength: 12,
                    minLowercase: 1,
                    minUppercase: 1,
                    minNumbers: 1,
                    minSymbols: 1,
                })
                .withMessage("Password does not meet requirements.")
        ]
    }


/********************
 * Login Data Validation Rules
 * ******************/    
validate.loginRules = () => {
    return [
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide an email address.")
            .bail()
            .isEmail()
            .withMessage("Please provide a valid email address.")
            .normalizeEmail(),

        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Please provide a password.")
    ]
}

/********************
 * Check data and return errors or continue login process
 * *******************/
validate.checkLoginData = async (req, res, next) => {
    const { account_email } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", errors.array().map((error) => error.msg))
        req.flash("formData", {
            account_email,
        })
        res.redirect("/account/login")
        return
    }
    next()
}

/********************
 * Check data and return errors or continue registration
 * ******************/
    validate.checkRegData = async (req, res, next) => {
        const { account_firstname, account_lastname, account_email } = req.body
        let errors = [] // Initialize an array to hold validation errors
        errors = validationResult(req) // Get validation results from the request
        if (!errors.isEmpty()) {
            req.flash("notice", errors.array().map((error) => error.msg))
            req.flash("formData", {
                account_firstname,
                account_lastname,
                account_email,
            })
            res.redirect("/account/register")
            return // Stop further processing if there are validation errors
        }
        next() // If validation passed, proceed to the next middleware or route handler
    }

/********************
 * Account Update Data Validation Rules
 * ******************/
validate.updateAccountRules = () => {
    return [
        // First name is required and must be a string
        body("account_firstname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a first name.")
            .bail()
            .isLength({ min: 1})
            .withMessage("Please provide a first name."),

        // Last name is required and must be a string
        body("account_lastname")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide a last name.")
            .bail()
            .isLength({ min: 2})
            .withMessage("Please provide a last name."),

        // Valid email is required and must not exist (unless it's the same email)
        body("account_email")
            .trim()
            .escape()
            .notEmpty()
            .withMessage("Please provide an email address.")
            .bail()
            .isEmail()
            .withMessage("Please provide a valid email address.")
            .normalizeEmail()
            .custom(async (account_email, { req }) => {
                // Get the current account data to check if email is being changed
                const currentAccount = await accountModel.getAccountById(req.body.account_id)
                // Only check if email exists if it's different from current email
                if (currentAccount && account_email !== currentAccount.account_email) {
                    const emailExists = await accountModel.checkExistingEmail(account_email)
                    if (emailExists) {
                        throw new Error("Email already exists. Please use a different email.")
                    }
                }
            })
    ]
}

/********************
 * Check account update data and return errors or continue
 * ******************/
validate.checkUpdateData = async (req, res, next) => {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", errors.array().map((error) => error.msg))
        req.flash("formData", {
            account_firstname,
            account_lastname,
            account_email,
        })
        res.redirect(`/account/update/${account_id}`)
        return
    }
    next()
}

/********************
 * Change Password Data Validation Rules
 * ******************/
validate.changePasswordRules = () => {
    return [
        // Password is required and must meet complexity requirements
        body("account_password")
            .trim()
            .notEmpty()
            .withMessage("Please provide a password.")
            .bail()
            .isStrongPassword({
                minLength: 12,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
            })
            .withMessage("Password does not meet requirements.")
    ]
}

/********************
 * Check change password data and return errors or continue
 * ******************/
validate.checkChangePasswordData = async (req, res, next) => {
    const { account_id } = req.body
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", errors.array().map((error) => error.msg))
        res.redirect(`/account/update/${account_id}`)
        return
    }
    next()
}

module.exports = validate // Export the validate object to be used in other parts of the application