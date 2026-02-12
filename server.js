/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require('./database/')
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
const utilities = require("./utilities")
const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")

/* ***********************
* Middleware
*************************/
app.use(session({
  store: new (require('connect-pg-simple') (session)) ({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Body Parser Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true})) // for parsing application/x-www-form-urlencoded

// Cookie Parser Middleware
app.use(cookieParser())

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at view roots

/* ***********************
 * Routes
 *************************/
app.use(static)
// Inventory Route

app.use("/inv", inventoryRoute)

// Account Route
app.use("/account", accountRoute)

// Index route
/***************app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})******/
app.get("/",utilities.handleErrors(baseController.buildHome))

// Intentional error route for testing
app.get("/trigger-error", utilities.handleErrors(baseController.triggerError))

/* ***********************
* 404 Error Route
*************************/
app.use(async (req, res, next) => {
  next({status: 404, message: "Sorry, we couldn't find that page."})
})



/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at:  "${req.originalUrl}": ${err.message}`)

  let message
  if (err.status == 404){ 
    message = err.message
  } else { 
    message = 'Oh no! There was a crash. Maybe try a different route?'
  }

  res.render("errors/error", {
    title: err.status || '500 - Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST



/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
