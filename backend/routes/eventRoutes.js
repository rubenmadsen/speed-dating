const { Router, response}    = require('express');
const { authorizeUser } = require('../authorization/authorize')
const Event = require("../models/eventModel")
const router = Router()

/**
 * Get all events
 */
router.get('/events',function (req,res){
    Event.find({}).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
    });
});


module.exports = router;