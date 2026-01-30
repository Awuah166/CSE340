const pool = require("../database/")
const { get } = require("../routes/static")

/*********************
 * Get all classification data
 ************ */
async function getClassifications() {
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

module.exports = {getClassifications, getInventoryByClassificationId};


/*********************
 * Get all inventory items and classification_name by classification id
 ************* */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classfication AS c
            ON i.classification_id = c.classificatio_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}