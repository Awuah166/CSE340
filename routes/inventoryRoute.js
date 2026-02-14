// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities")
const invValidate = require("../utilities/inventory_validation")

// Route to build add classification view
router.get("/add-classification", utilities.checkJWTToken, utilities.checkAuthorization, utilities.handleErrors(invController.buildAddClassification))

// Route to build add inventory view
router.get("/add-inventory", utilities.checkJWTToken, utilities.checkAuthorization, utilities.handleErrors(invController.buildAddInventory))

// Route to build inventory management view
router.get("/", utilities.checkJWTToken, utilities.checkAuthorization, utilities.handleErrors(invController.buildManagement));

// Route to build inventory by classification view
router.get("/type/:classification_id", utilities.handleErrors(invController.buildByClassificationId));

// Route to build inventory detail view
router.get("/detail/:invId", utilities.handleErrors(invController.buildInventoryDetail))

// Route to build edit inventory view
router.get("/edit/:invId", utilities.checkJWTToken, utilities.checkAuthorization, utilities.handleErrors(invController.buildEditInventory))

// Route to delete inventory item 
router.get("/delete/:invId", utilities.checkJWTToken, utilities.checkAuthorization, utilities.handleErrors(invController.buildDeleteInventory))

// Route to build inventory items in JSON format based on the classification_id
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// Route to process add classification
router.post("/add-classification", utilities.checkJWTToken, utilities.checkAuthorization, invValidate.classificationRules(), invValidate.checkClassificationData, utilities.handleErrors(invController.addClassification))

// Route to process delete inventory item
router.post("/delete/", utilities.checkJWTToken, utilities.checkAuthorization, utilities.handleErrors(invController.deleteInventory))

// Route to process inventory update
router.post(
    "/update/",
    utilities.checkJWTToken, utilities.checkAuthorization,
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

// Route to process add inventory
router.post(
    "/add-inventory",
    utilities.checkJWTToken,
    utilities.checkAuthorization,
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
)



module.exports = router