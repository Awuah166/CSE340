const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/*********************
 * Build inventory management view
 * ********************/
invCont.buildManagement = async function (req, res) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList()
    res.render("./inventory/management", {
        title: "Inventory Management",
        nav,
        classificationSelect
    })
}

/*****************
 * Build add classification view
 *******************/
invCont.buildAddClassification = async function (req, res) {
    let nav = await utilities.getNav()
    const formData = req.flash("formData")[0] || {}

    res.render("./inventory/add-classification", {
        title: "Add Classification",
        nav,
        errors: null,
        classification_name: formData.classification_name || ""
    })
}

/********************
 * Process add classification
 * *****************/
invCont.addClassification = async function (req, res) {
    const { classification_name } = req.body
    const result = await invModel.addClassification(classification_name)
    let nav = await utilities.getNav()

    if (result) {
        req.flash("notice", "Classification added successfully.")
        res.render("./inventory/management", {
            title: "Inventory Management",
            nav
        })
    } else {
        req.flash("notice", "Sorry, there was an error adding the classification.")
        res.status(500).render("./inventory/add-classification", {
            title: "Add Classification",
            nav,
            errors: null,
            classification_name
        })
    }
}

/***********************
 * Build add invenntory view
 * **********************/
invCont.buildAddInventory = async function (req, res) {
    let nav = await utilities.getNav()
    const formData = req.flash("formData")[0] || {}
    const classificationList = await utilities.buildClassificationList(
        formData.classification_id || null
    )

    res.render("./inventory/add-inventory", {
        title: "Add Inventory",
        nav,
        errors: null,
        classificationList,
        ...formData
    })
}

/*********************
 * Process add inventory
 * ********************/
invCont.addInventory = async function (req, res) {
    const result = await invModel.addInventory(req.body)
    let nav = await utilities.getNav()

    if (result) {
        req.flash("notice", "Inventory item added successfully")
        res.render("./inventory/management", {
            title: "Inventory Management",  
            nav
        })
    } else {
        const classificationList = await utilities.buildClassificationList(
            req.body.classification_id || null
        )
        req.flash("notice", "Sorry, the inventory item could not be added.")
        res.status(500).render("./inventory/add-inventory", {
            title: "Add Inventory",
            nav, 
            errors: null,
            classificationList,
            ...req.body
        })
    }
}

/***********************
 * Build inventory by classification view
**********************/
invCont.buildByClassificationId = async function (req, res) {
    const classification_id = req.params.classification_id
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

/********************
 * Return Inventory by Classification as JSON
 * ******************/
invCont.getInventoryJSON = async function (req, res, next) {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
        return res.json(invData)
    } else {
        next(new Error("No data Returned"))
    }
}

module.exports = invCont