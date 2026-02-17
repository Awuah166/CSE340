const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config()

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
 * Deliver account management view
 * *******************/
async function buildAccountManagement(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/account-management", {
        title: "Account Management",
        nav,
        errors: null,
    })
}

/********************
 * Deliver account update view
 * *******************/
async function buildUpdateAccount(req, res, next) {
    let nav = await utilities.getNav()
    const account_id = parseInt(req.params.account_id)
    const accountData = await accountModel.getAccountById(account_id)
    
    if (!accountData) {
        req.flash("notice", "Account not found.")
        return res.redirect("/account/")
    }

    res.render("account/update-account", {
        title: "Update Account Information",
        nav,
        errors: null,
        ...accountData
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

/********************
 * Process login request
 * *******************/
async function accountLogin(req, res) {
    let nav = await utilities.getNav()
    const { account_email, account_password } = req.body
    const accountData = await accountModel.getAccountByEmail(account_email)

    if (!accountData) {
        req.flash("notice", "Please check your credentials and try again.")
        res.status(400).render("account/login", {
            title: "Login",
            nav,
            errors: null,
            account_email,
        })
        return
    }
    try {
        if (await bcrypt.compare(account_password, accountData.account_password)) {
            delete accountData.account_password
            const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
            if(process.env.NODE_ENV === 'development') {
                res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
            } else {
                res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
            }
            return res.redirect("/account/")
        }
        else {
            req.flash("message notice", "Please check your credentials and try again.")
            res.status(400).render("account/login", {
                title: "Login",
                nav,
                errors: null,
                account_email,
            })
        }
    } catch (error) {
        throw new Error('Access Forbidden')
    }
}

/********************
 * Process account update
 * *******************/
async function updateAccount(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_firstname, account_lastname, account_email } = req.body
    
    const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)
    
    if (updateResult) {
        // Fetch updated account data
        const updatedAccount = await accountModel.getAccountById(account_id)
        req.flash("notice", "Account information updated successfully.")
        res.render("account/account-management", {
            title: "Account Management",
            nav,
            errors: null,
            accountData: updatedAccount
        })
    } else {
        const currentAccount = await accountModel.getAccountById(account_id)
        req.flash("notice", "Sorry, the update failed.")
        res.status(500).render("account/update-account", {
            title: "Update Account Information",
            nav,
            errors: null,
            ...currentAccount
        })
    }
}

/********************
 * Process password change
 * *******************/
async function changePassword(req, res) {
    let nav = await utilities.getNav()
    const { account_id, account_password } = req.body
    
    // Hash the password before storing
    let hashedPassword
    try {
        hashedPassword = await bcrypt.hashSync(account_password, 10)
    } catch (error) {
        req.flash("notice", "Sorry, there was an error processing your password change.")
        const currentAccount = await accountModel.getAccountById(account_id)
        return res.status(500).render("account/update-account", {
            title: "Update Account Information",
            nav,
            errors: null,
            ...currentAccount
        })
    }
    
    const updateResult = await accountModel.updatePassword(account_id, hashedPassword)
    
    if (updateResult) {
        // Fetch updated account data
        const updatedAccount = await accountModel.getAccountById(account_id)
        req.flash("notice", "Password changed successfully.")
        res.render("account/account-management", {
            title: "Account Management",
            nav,
            errors: null,
            accountData: updatedAccount
        })
    } else {
        const currentAccount = await accountModel.getAccountById(account_id)
        req.flash("notice", "Sorry, the password change failed.")
        res.status(500).render("account/update-account", {
            title: "Update Account Information",
            nav,
            errors: null,
            ...currentAccount
        })
    }
}

/********************
 * Logout process
 * *******************/
async function logout(req, res) {
    res.clearCookie("jwt")
    req.flash("notice", "You have been logged out successfully.")
    res.redirect("/")
}

module.exports = { buildLogin, buildRegister, buildAccountManagement, buildUpdateAccount, registerAccount, accountLogin, updateAccount, changePassword, logout }