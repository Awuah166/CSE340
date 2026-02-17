const pool = require("../database/")
//const { get } = require("../routes/static")

/*********************
 * Get all classification data
 ************ */
async function getClassifications() {
    return await pool.query(
        "SELECT * FROM public.classification ORDER BY classification_name"
    )
}




/*********************
 * Get all inventory items and classification_name by classification id
 ************* */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        throw error
    }
}

/*******************
 * Get a specific inventory item by id
 *******************/
async function getInventoryById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory
            WHERE inv_id = $1`,
            [inv_id]
        )
        return data.rows[0]
    } catch (error) {
        throw error
    }
}

/***************
 * Add a new classification
 *******************/
async function addClassification(classification_name) {
    try { 
        const data = await pool.query(
            "INSERT INTO public.classification (classification_name) VALUES ($1) RETURNING *",
            [classification_name]
        )
        return data.rows[0]
    } catch (error) {
        return null
    }
}

/*********************
 * Add a new inventory item
 * *********************/
async function addInventory(invData) {
    try {
        const sql = `
            INSERT INTO public.inventory 
            (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *`
        const params = [
            invData.inv_make,
            invData.inv_model,
            invData.inv_year,
            invData.inv_description,
            invData.inv_image,
            invData.inv_thumbnail,
            invData.inv_price,
            invData.inv_miles,
            invData.inv_color,
            invData.classification_id
        ]
        const data = await pool.query(sql, params)
        return data.rows[0]
    } catch (error) {
        return null
    }
}

/*********************
 * Update Inventory Data
 * *********************/
async function updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
) {
    try {
        const sql = `
            UPDATE public.inventory 
            SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10
            WHERE inv_id = $11 RETURNING *`

        const data = await pool.query(sql, [
            inv_make,
            inv_model,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color,
            classification_id,
            inv_id
        ])
        return data.rows[0]
    } catch (error) {
        console.error("model error: " + error)
    }
}

/*********************
 * Delete inventory item
 * *********************/
async function deleteInventory(inv_id) {
    try {
        const sql = "DELETE FROM public.inventory WHERE inv_id = $1 RETURNING *"
        const data = await pool.query(sql, [inv_id])
        return data.rows[0]
    } catch (error) {
        console.error("delete error: " + error)
        return null
    }
}

/*********************
 * Get inventory analytics data
 * *********************/
async function getInventoryAnalytics() {
    try {
        // Total vehicles count
        const totalVehicles = await pool.query(
            "SELECT COUNT(*) as total FROM public.inventory"
        )

        // Vehicles by classification
        const vehiclesByClassification = await pool.query(
            `SELECT c.classification_name, COUNT(i.inv_id) as count 
             FROM public.inventory i
             JOIN public.classification c ON i.classification_id = c.classification_id
             GROUP BY c.classification_name
             ORDER BY c.classification_name`
        )

        // Price statistics
        const priceStats = await pool.query(
            `SELECT 
                MIN(inv_price)::NUMERIC(10,2) as min_price,
                MAX(inv_price)::NUMERIC(10,2) as max_price,
                AVG(inv_price)::NUMERIC(10,2) as avg_price
             FROM public.inventory`
        )

        // Average miles
        const averageMiles = await pool.query(
            "SELECT AVG(inv_miles)::NUMERIC(10,2) as average_miles FROM public.inventory"
        )

        // Total inventory value
        const totalValue = await pool.query(
            "SELECT SUM(inv_price)::NUMERIC(15,2) as total_value FROM public.inventory"
        )

        // Most common make
        const mostCommonMake = await pool.query(
            `SELECT inv_make, COUNT(*) as count 
             FROM public.inventory
             GROUP BY inv_make
             ORDER BY count DESC
             LIMIT 1`
        )

        // Vehicles by color
        const vehiclesByColor = await pool.query(
            `SELECT inv_color, COUNT(*) as count 
             FROM public.inventory
             GROUP BY inv_color
             ORDER BY count DESC
             LIMIT 5`
        )

        return {
            totalVehicles: totalVehicles.rows[0].total,
            vehiclesByClassification: vehiclesByClassification.rows,
            priceStats: priceStats.rows[0],
            averageMiles: averageMiles.rows[0].average_miles,
            totalValue: totalValue.rows[0].total_value,
            mostCommonMake: mostCommonMake.rows[0],
            vehiclesByColor: vehiclesByColor.rows
        }
    } catch (error) {
        console.error("analytics error: " + error)
        return null
    }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryById, addClassification, addInventory, updateInventory, deleteInventory, getInventoryAnalytics};