// Imports
const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('express-flash')
const logger = require('morgan')
// MongoDB connection
const connectDB = require('./config/database')
// Route imports
const mainRoutes = require('./routes/main')
const todoRoutes = require('./routes/todos')
const steamRoutes = require('./routes/steam')


// Setup config
require('dotenv').config({path: './config/.env'})
require('./config/passport')(passport)
require('./config/steamAuth')


function setupMiddleware() {
    app.set('view engine', 'ejs')
    app.set('views', __dirname + '/views')
    app.set('layout', 'layouts/main')
    app.use(expressLayouts)
    app.use(express.static('public'))
    app.use('*/js', express.static('public/js'));
    app.use('*/css', express.static('public/css'));
    app.use(express.urlencoded({extended: true}))
    app.use(express.json())
    app.use(logger('dev'))
    // Sessions
    app.use(session({
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({mongooseConnection: mongoose.connection})
        })
    )
    // Passport middleware
    app.use(passport.initialize())
    app.use(passport.session())

    app.use(flash())
}

function setupRoutes() {
    app.use('/', mainRoutes)
    app.use('/todos', todoRoutes)
    app.use('/steam', steamRoutes)
}

async function startServer() {
    // Wait for db connection before starting server, to avoid bugs where the server starts before the db is ready.
    // (i.e, when nodemon automatically refreshes after changes are made to the server and immediately tries to query the db.)
    await connectDB()
    setupMiddleware()
    setupRoutes()
    app.listen(process.env.PORT, () => {
        console.log('Server is running, you better catch it!')
    })
}


// ----------------------------------------
// This is the entry point!
startServer()
