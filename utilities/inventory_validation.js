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
           .withMessage("Classification name must contain only letters and numbers. No spaces or special characters allowed.")
           .bail()
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
            .withMessage("Make is required.")
            .bail()
            .isLength({ min: 1, max: 50 })
            .withMessage("Make must be between 1 and 50 characters."),
        
        body("inv_model")
            .trim()
            .notEmpty()
            .withMessage("Model is required.")
            .bail()
            .isLength({ min: 1, max: 50 })
            .withMessage("Model must be between 1 and 50 characters."),

        body("inv_year")
            .trim()
            .notEmpty()
            .withMessage("Year is required.")
            .bail()
            .isInt({ min: 1900, max: 2100 })
            .withMessage("Year must be a 4-digit year between 1900 and 2100."),

        body("inv_description")
            .trim()
            .notEmpty()
            .withMessage("Description is required.")
            .bail()
            .isLength({ min: 10, max: 1000 })
            .withMessage("Description must be between 10 and 1000 characters."),

        body("inv_image")
            .trim()
            .notEmpty()
            .withMessage("Image path is required.")
            .bail()
            .matches(/^\/images\//)
            .withMessage("Image path must be a valid path."),

        body("inv_thumbnail")
            .trim()
            .notEmpty()
            .withMessage("Thumbnail path is required.")
            .bail()
            .matches(/^\/images\//)
            .withMessage("Thumbnail path must be a valid path."),

        body("inv_price")
            .trim()
            .notEmpty()
            .withMessage("Price is required.")
            .bail()
            .isInt({ min: 0, max: 9999999 })
            .withMessage("Price must be a valid number."),

        body("inv_miles")
            .trim()
            .notEmpty()
            .withMessage("Miles is required.")
            .bail()
            .isInt({ min: 0, max: 999999999 })
            .withMessage("Miles must be a valid number."),

        body("inv_color")
            .trim()
            .notEmpty()
            .withMessage("Color is required.")
            .bail()
            .isLength({ min: 1, max: 50 })
            .withMessage("Color must be between 1 and 50 characters."),

        body("classification_id")
        .trim()
        .notEmpty()
        .withMessage("Classification is required.")
        .bail()
        .isInt({ min: 1 })
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

// Check data and return errors if any for the edit view
validate.checkUpdateData = async (req, res, next) => {
    const { inv_id, inv_make, inv_model } = req.body
    const errors = validationResult(req)
    
    if (!errors.isEmpty()) {
        let nav = await utilities.getNav()
        const classificationList = await utilities.buildClassificationList()
        const name = `${inv_make} ${inv_model}`

        req.flash("notice", errors.array().map((error) => error.msg))
        req.flash("formData", req.body)
        res.status(501).render("./inventory/edit-inventory", {
            title: `Edit ${name}`,
            nav,
            classificationList,
            errors: null,
            inv_id,
            ...req.body
        })
        return
    }
    next()
}

module.exports = validate