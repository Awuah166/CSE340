const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const accountCont = {}

/**************
 * Deliver login view
 * **************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    const formData = req.flash("formData")[0] || {}
    res.render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email: formData.account_email || ""
    })
}

/*******************
 * Deliver registration view
 * *******************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    const formData = req.flash("formData")[0] || {}
    res.render("account/register", {
        title: "Register",
        nav,
        errors: null,
        account_firstname: formData.account_firstname || "",
        account_lastname: formData.account_lastname || "",
        account_email: formData.account_email || ""
    })
}

/********************
 * Process regitsration form submission
 * ******************/
async function registerAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_firstname, account_lastname, account_email, account_password } = req.body

    // Hash the password before storing
    let hashedPassword
    try {
        // Regular password and cost (salt is generated automatically)
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing your the registration.")
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
    )

    if (regResult) {
        req.flash(
            "notice",
            `Congratulations, you\'re successfully registered ${account_firstname}. Please login.`
        )
        res.status(201).render("account/login", {
            title: "Login",
            nav,
        })
    } else {
        req.flash("notice", "Sorry, there was an error with registration. Please try again.")
        res.status(501).render("account/register", {
            title: "Register",
            nav,
        })
    }
}

module.exports = { buildLogin, buildRegister, registerAccount }