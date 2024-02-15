const { Router, response}    = require('express');
const { authorizeUser } = require('../authorization/authorize')
const Activity = require("../models/activityModel")
const router = Router()

/**
 * Get all activities
 */
router.get('/activity',function (req,res){
    Activity.find({}).populate("category").then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.log(err)
    });
});


module.exports = router;