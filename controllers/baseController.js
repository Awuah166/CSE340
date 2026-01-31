const utilities = require("../utilities/")
const baseController = {}

baseController.buildHome = async function(req, res){
    const nav = await utilities.getNav()
    res.render("index", {title: "Home", nav})
}

/******************
 * Intentionally trigger a 500 error
 * ****************/
baseController.trigerError = async function(req, res, next) {
    throw new Error("Intentional 500 Error - This is a test error for handling!")
}

module.exports = baseController