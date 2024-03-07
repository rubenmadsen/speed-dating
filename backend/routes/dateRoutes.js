/**
 * Routes for dates
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Date = require("../models/dateModel");
const User = require("../models/userModel");
const MatchingAlgorithm = require("../classes/MatchingAlgorithm");
const DateFeedbackModel = require("../models/dateFeedbackModel");

const router = Router();

/**
 * Get specific Date
 */
router.get("/date/:dateId",authorizeUser,function (req,res){
   Date.findById(req.params.dateId).populate({
       path: 'personOne',
       model: 'user'
   }).populate({
       path: 'personTwo',
       model: 'user'
   }).then(date => {
       res.send(date);
   })
});

/**
 * Match user1 with user2
 */
router.get("/date/:user1Id/:user2Id/match", authorizeUser, async function(req,res){
    const updatedUser = await User.updateOne(
        {_id:req.params.user1Id},
        { $push: { sharedContacts: { _id:req.user2Id } } }
    )
    res.send()
})

/**
 * Unmatch user1 with user2
 */
router.get("/date/:user1Id/:user2Id/unmatch", authorizeUser, async function(req,res){
    const updatedUser = await User.updateOne(
        {_id:req.params.user1Id},
        { pull: { sharedContacts: { _id:req.user2Id } } }
    )
    res.send()
})
/**
 * Match users for date
 */
router.get("/date/match/:user1Id/:user2Id", authorizeUser, async function (req, res) {
    console.log(req.params.user1Id)
    const u1 = await User.findById(req.params.user1Id).populate("activityData.activity");
    const u2 = await User.findById(req.params.user2Id).populate("activityData.activity");

    //res.send(u1);

    const matcher = new MatchingAlgorithm();
    await matcher.loadCategoriesAndActivities();
        await matcher.calculateActivityScores(u1,u2).then(date => {
            console.log(date);
            res.send(date)
    });
});

/**
 * Swap tables
 */
router.get("/date/swaptables/:table1Id/:table2Id", authorizeUser, async function (req, res) {
    Date.findById(req.params.table1Id).then(t1 =>{
        Date.findById(req.params.table2Id).then(t2 => {
            const store = t1.tableNumber;
            t1.tableNumber = t2.tableNumber;
            t2.tableNumber = store;
            t1.save().then(() => {
                t2.save().then(() => {
                    res.send();
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});

/**
 * Get Dates for even
 */
router.put("/date/datefeedback/:feedbackId", async (req,res) => {
    try{
        const {feedbackId} = req.params;
        const updateData = req.body
        const updatedFeedback = await DateFeedbackModel.findByIdAndUpdate(feedbackId, updateData, { new: true });
        if (!updatedFeedback) {
            return res.status(404).send({ message: 'Feedback not found' });
        }
        res.status(200).json(updatedFeedback);    
    }catch(err){
        res.status(500).send({message: "Couldnt create feedback"});
    }
});


router.put("date/:dateId", async (req , res) => {
    try {
        const { dateId } = req.params;
        const updateData = req.body;
        const updatedDate = await DateModel.findByIdAndUpdate(dateId, updateData, { new: true });
        if (!updatedDate) {
            return res.status(404).send({ message: 'Date not found' });
        }
        res.status(200).json(updatedDate);
    } catch(error){
        res.status(500).send({ message: 'Error updating date', error });

    }

})

module.exports = router;
