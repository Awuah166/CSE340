const utilities = require(".") // Requiring the utilities index file to access all utility functions
    const { body, validationResult } = require("express-validator") // Importing express-validator functions for input validation
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
                .isLength({ min: 1})
                .withMessage("Please provide a first name."), // On error this message is sent

            // Last name is required and must be a string
            body("account_lastname")
                .trim()
                .escape()
                .notEmpty()
                .isLength({ min: 2})
                .withMessage("Please provide a last name."), // On error this message is sent

            // Valid email is required and must not already exist in the database
            body("account_email")
                .trim()
                .escape()
                .notEmpty()
                .isEmail()
                .normalizeEmail() // refer to validator.js docs
                .withMessage("Please provide a valid email address."),

            // Password is required and must meet complexity requirements
            body("account_password")
                .trim()
                .notEmpty()
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
 * Check data and return errors or continue registration
 * ******************/
    validate.checkRegData = async (req, res, next) => {
        const { account_firstname, account_lastname, account_email } = req.body
        let errors = [] // Initialize an array to hold validation errors
        errors = validationResult(req) // Get validation results from the request
        if (!errors.isEmpty()) {
            let nav = await utilities.getNav() // Get navigation data for rendering the view
            res.render("account/register", {
                errors,
                tittle: "Registration",
                nav,
                account_firstname,
                account_lastname,
                account_email,
            })
            return // Stop further processing if there are validation errors
        }
        next() // If validation passed, proceed to the next middleware or route handler
    }

module.exports = validate // Export the validate object to be used in other parts of the application