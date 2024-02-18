const { Router, response}    = require('express');
const { authorizeUser } = require('../authorization/authorize')
const Event = require("../models/eventModel")
const City = require("../models/cityModel")
const router = Router()

/**
 * Get all events
 */
router.get('/event', function (req,res){
    Event.find({}).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
    });
});

// 65cf16aa20e795caa778d7be
router.get('/event/city/:cityID',function (req,res){
    City.findById(req.params.cityID).then(city => {
        console.log("City",city);
        Event.find({city: req.params.cityID}).then(result => {
            console.log("params",req.params)
            res.send(result);
        }).catch(err => {
            console.log(err);
            res.status(500);
        })
    }).catch(err => {
        console.log("When finding city by id", err);
    })

});
module.exports = router;