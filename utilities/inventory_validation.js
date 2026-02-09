const { body, validationResult} = require("express-validator")
const validate = {}

validate.classificationRules = () => {
    return [
        body("classification_name")
           .trim()
           .notEmpty()
           .withMessage("Please provide a classification name.")
           .bail()
           .isAlphanumeric("en-US")
           .withMessage("Classification name must contain only letters and numbers.")
           .isLength({ min:1, max: 30})
           .withMessage("Classification name must be between 1 and 30 characters.")
    ]
}

// Check data and return errors if any
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        req.flash("notice", errors.array().map((error) => error.msg))
        req.flash("formData", { classification_name })
        return res.redirect("/inv/add-classification")
    }
    next()
}

validate.inventoryRules = () => {
    return [
        body("inv_make")
            .trim()
            .notEmpty()
            .withMessage("Make is required."),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required."),

        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required.")
            .bail()
            .isInt({ min: 1900, max: 2099 })
            .withMessage("Year must be a 4-digit year"),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required."),

        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required.")
            .bail()
            .isInt({ min: 0 })
            .withMessage("Price must be a whole number."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Miles is required.")
            .bail()
            .isInt({ min: 0 })
            .withMessage("Miles must be a whole number."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required."),

        body("classification_id")
        .trim()
        .notEmpty()
        .withMessage("Classification is required.")
        .bail()
        .isInt()
        .withMessage("Classification must be a valid selection.")
    ]
}

// Check data and return errors if any
validate.checkInventoryData = async (req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        req.flash("notice", errors.array().map((error) => error.msg))
        req.flash("formData", req.body)
        return res.redirect("/inv/add-inventory")
    }
    next()
}

module.exports = validate