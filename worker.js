if(process.env.NEW_RELIC_LICENSE_KEY) require('newrelic')

var express = require('express')
var path    = require('path')
var stylus  = require('stylus')
var bparser = require('body-parser')
var raven   = require('raven')



// global variables (and list of all used environment variables)
APP_VERSION   = require('./package').version
APP_STARTED   = new Date().toISOString()
APP_PORT      = process.env.PORT || 3000
APP_ENTU_URL  = process.env.ENTU_URL || 'https://kunda.entu.ee/api2'
APP_ENTU_USER = process.env.ENTU_USER
APP_ENTU_KEY  = process.env.ENTU_KEY



// initialize getsentry.com client
var raven_client = new raven.Client({
    release: APP_VERSION,
    dataCallback: function(data) {
        delete data.request.env
        return data
    }
})



// start express app
express()
    // jade view engine
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'jade')

    // logs to getsentry.com - start
    .use(raven.middleware.express.requestHandler(raven_client))

    // parse POST requests
    .use(bparser.json())
    .use(bparser.urlencoded({extended: true}))

    // stylus to css converter
    .use(stylus.middleware({src: path.join(__dirname, 'public'), compress: true}))

    // static files path & favicon
    .use(express.static(path.join(__dirname, 'public')))

    // routes mapping
    .use('/',         require('./routes/index'))

    // logs to getsentry.com - error
    .use(raven.middleware.express.errorHandler(raven_client))

    // 404
    .use(function(req, res, next) {
        var err = new Error('Not Found')
        err.status = 404
        next(err)
    })

    // error
    .use(function(err, req, res, next) {
        var status = parseInt(err.status) || 500

        res.status(status)
        res.render('error', {
            title: status,
            message: err.message
        })

        if(err.status !== 404) console.log(err)
    })

    // start server
    .listen(APP_PORT)



console.log(new Date().toString() + ' started listening port ' + APP_PORT)
