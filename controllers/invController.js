const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/***********************
 * Build inventory by classification view
**********************/
invCont.buildByClassificationId = async function (req, res) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0){
        throw new Error("No vehicles found for classification")
    }

    const grid = await utilities.buildByClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/********************
 * Build inventory detail view
 * ******************/
invCont.buildInventoryDetail = async function (req, res) {
    const inv_id = req.params.invId
    const vehicle = await invModel.getInventoryById(inv_id)
    let nav = await utilities.getNav()

    if (!vehicle) {
        throw new Error("Vehicle not found")
    }
        const detail = utilities.buildVehicleDetail(vehicle)

        res.render("./inventory/detail", {
            title: vehicle.inv_make + ' ' + vehicle.inv_model,
            nav,
            detail,
        })
}

module.exports = invCont