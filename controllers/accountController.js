const utilities = require("../utilities/")

const accountCont = {}

/**************
 * Deliver login view
 * **************/
async function buildLogin(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/login", {
        title: "Login",
        nav
    })
}

/*******************
 * Deliver registration view
 * *******************/
async function buildRegister(req, res, next) {
    let nav = await utilities.getNav()
    res.render("account/register", {
        title: "Register",
        nav,
        error: null
    })
}

module.exports = { buildLogin, buildRegister }