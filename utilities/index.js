const invModel = require("../models/inventory-model")
const Util = {}

/*********************
 * Construct the nav HTML unordered list
******************/
Util.getNav = async function() {
    let data = await invModel.getClassifications()
    let list = "<ul>"
    list += '<li><a href="/" title="Home page">Home</a></li>'
    data.rows.forEach((row) => {
        list += "<li>"
        list +=
            '<a href="/inv/type/' +
            row.classification_id +
            '" title="See our inventory of ' +
            row.classification_name +
            ' vehicles">' +
            row.classification_name +
            "</a>"
            list += "</li>"
    })
    list += "</ul>"
    return list
}




/**********************
 * Build the inventory detail view HTML
 * *********************/
Util.buildVehicleDetail = function (vehicle) {
    if(!vehicle) {
        return '<p class="notice">Sorry, that vehicle could not be found.</p>'
    }

    let detail = '<section class="detail-container">'
    detail += '<div class="detail-image">'
    detail += `<img src="${vehicle.inv_image}" alt="Image of ${vehicle.inv_make} 
    ${vehicle.inv_model}">`
    detail += '</div>'

    detail += '<div class="detail-info">'
    detail += `<h2>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h2>`
    detail += `<p><strong>Year:</strong> ${vehicle.inv_year}</p>`
    detail += `<p><strong>Model:</strong> ${vehicle.inv_model}</p>`
    detail += `<p><strong>Color:</strong> ${vehicle.inv_color}</p>`
    detail += `<p><strong>Mileage:</strong> ${new Intl.NumberFormat('en-US').format(vehicle.inv_miles)} miles</p>`
    detail += `<p class="price"><strong>Price:</strong> $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`
    detail += '</div>'

    detail += '<div class="detail-description">'
    detail += '<h3>Description</h3>'
    detail += `<p>${vehicle.inv_description}</p>`
    detail += '</div>'
    detail += '</section>'

    return detail

}




/*********************
 * Build the classification view HTML
 * ******************/
Util.buildByClassificationGrid = function (data) {
    let grid
    
    if(data.length > 0) {
        grid = '<ul id="inv-display">'
        data.forEach(vehicle => {
            grid += '<li>'
            grid += '<a href="/inv/detail/'+ vehicle.inv_id
            + '" title="View ' + vehicle.inv_make +' ' + vehicle.inv_model
            + ' details"><img src="' + vehicle.inv_thumbnail
            +'" alt="Image of ' + vehicle.inv_make + ' ' + vehicle.inv_model
            +' on CSE Motors" /></a>'
            grid += '<div class="namePrice">'
            grid += '<hr />'
            grid += '<h2>'
            grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View '
            + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">'
            + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
            grid += '</h2>'
            grid += '<span>$'
            + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
            grid += '</div>'
            grid += '</li>'
        })
        grid += '</ul>'
    } else {
       grid = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
}

/*********************
 * Middleware for handling errors
 * Wrap other function in this for
 * General error handling
 * ******************/
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util