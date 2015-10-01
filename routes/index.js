var router  = require('express').Router()



// GET app version and start datetime
router.get('/version', function(req, res, next) {
    res.setHeader('Content-Type', 'application/json')
    res.status(200)
    res.send({
        version: APP_VERSION,
        started: APP_STARTED
    })
})



module.exports = router
