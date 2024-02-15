const { Router, response}    = require('express');
const { authorizeUser } = require('../authorization/authorize')
const router = Router()
const City = require("../models/cityModel")

/**
 * Get all cities
 */
router.get('/city', function (req,res){
    City.find({}).then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err);
    });
});


module.exports = router;