const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Date = require("../models/dateModel");
const User = require("../models/userModel");
const DateFeedBack = require("../models/dateFeedbackModel")


const router = Router();

router.get("/feedback/dateFeedback/:feedbackId", async function (req, res){
    console.log("t")
    DateFeedBack.findById(req.params.feedbackId).then(fb =>{
        res.send(fb);
    });
});


module.exports = router;
