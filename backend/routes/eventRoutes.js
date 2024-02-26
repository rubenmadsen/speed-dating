/**
 * Routes for events
 */
const { Router, response, length} = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const DateFeedBack = require("../models/dateFeedbackModel");
const Date = require("../models/dateModel");

const MatchingAlgorithm = require("../classes/MatchingAlgorithm");
const events = require("events");

const router = Router();

/**
 * Get all events
 */
router.get("/event", function (req, res) {
  Event.find({})
    .populate("city")
    .populate("participants")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * New event
 */
router.post("/event", authorizeUser, async (req, res) => {
    console.log("req.body",req.body)
  try {
    const user = await User.findById(req.user.id);
    if(user.isOrganizer){
      req.body.organizer = user;

      const newEvent = req.body;
      const r = Math.floor(Math.random() * 12);

      newEvent.imagePath = `venues/venue${r}.jpg`
      const unpopulatedResult = await Event.create(newEvent);
      const populatedResult = await Event.findById(unpopulatedResult._id).populate('city');

      user.events.push(populatedResult._id);
      await user.save();
      res.status(201).send(populatedResult);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Registration error" });
  }
});
/**
 * Delete an Event
 */
router.delete("/event/:eventId",authorizeUser,function (req,res){
    Event.deleteOne({_id:req.params.eventId}).then(result =>{
       res.send()
    }).catch(err => console.log(err));
});
/**
 * Retrieve a specific event
 */
router.get("/event/:eventId",authorizeUser,function (req,res){
    console.log("Incoming event id:" + req.params.eventId)
    Event.findById(req.params.eventId).populate("dates").then(result => {
        //console.log("event",result)
        res.send(result);
    }).catch(err => {
        res.status(404).send();
        console.log(err);
    });
});
/**
 * Generates the next date round
 */
router.get("/event/:eventId/next",authorizeUser, function (req, res) {
    console.log("event id", req.params.eventId)
    Event.findById(req.params.eventId).then(async event => {
        const matcher = new MatchingAlgorithm();
        console.log("Event",event)
        matcher.loadDataForEvent(event).then(() => {
            matcher.pairAll().then(async dates => {
                console.log("Generated dates for next round")
                // for (const d of dates) {
                //     await d.save();
                // }
                Event.findById(req.params.eventId).populate({
                    path: 'dates', // Populate the 'dates' field
                    populate: [
                        { path: 'personOne' }, // Within each 'date', populate 'personOne'
                        { path: 'personTwo' }  // And 'personTwo'
                    ]
                }).then(upDates => {

                    console.log(upDates)
                    res.status(200).send(upDates.dates);
                });
            });
        });
    });
});

/**
 * Clears the last generated automatch
 */
router.get("/event/:eventId/clear",authorizeUser,function(req,res){

});

// router.get("/event/:eventId", function (req, res) {
//   console.log("event id", req.params.eventId)
//   Event.findById(req.params.eventId).then(async event => {
//
//   });
// });
/**
 * Join an event
 */
router.get("/event/:eventId/join", authorizeUser, async function (req, res) {
    const me = await User.findById(req.user.id);

    Event.findById(req.params.eventId).populate("participants").then( event => {
        if (event.participants.filter(participant => participant.gender === me.gender).length < 10 && !event.participants.includes(me) && me.isOrganizer === false){
            event.participants.push(me)
            event.currentParticipants++;
            event.save().then(() => {
                me.events.push(event)
                me.save().then(() => {
                    res.send();
                });
            });
        }
        else{
            res.status(401).send();
        }
    });
});
/**
 * Leave an event
 */
router.get("/event/:eventId/leave", authorizeUser, async function (req, res) {
    try {
        const userId = req.user.id; // Assuming this is correctly populated
        const eventId = req.params.eventId;
        const eventUpdateResult = await Event.updateOne(
            { _id: eventId },
            { $pull: { participants: userId } }
        );
        const userUpdateResult = await User.updateOne(
            { _id: userId },
            { $pull: { eventsAttended: eventId } } // Assuming the field is named eventsAttended
        );
        if (eventUpdateResult.modifiedCount === 0 || userUpdateResult.modifiedCount === 0) {
            // Handle the case where the updates didn't modify any documents
            return res.status(404).send({ message: "Not found or nothing to remove" });
        }
        res.send({ message: "Successfully left the event" });
    } catch (error) {
        console.error('Error leaving event', error);
        res.status(500).send({ message: "Error leaving the event" });
    }
});

router.post("/event/stream", function (req, res) {
    let pingpong = req.body;
    pingpong.items = [];
    console.log("ping",pingpong);
    Event.find({})
        .populate("city")
        .populate("participants")
        .skip(pingpong.retrieved)
        .limit(pingpong.amount)
        .then((result) => {
            pingpong.items = result;
            pingpong.retrieved += result.length;
            console.log("pong",pingpong)
            res.status(200).send(pingpong);
        })
        .catch((err) => {
            console.log(err);
        });
});

router.get("/event/:eventId/simulatedates",async function (req, res) {
    const event = await Event.findById(req.params.eventId).populate("dates")
    console.log("event",event)
    if (event.round === 0)
        res.send({message:"There is no dates to match"})
    for (let i = 0; i < event.dates.length; i++) {
        let date = event.dates[i];
        const fbOne = new DateFeedBack();
        fbOne.author = date.personOne;
        fbOne.date = date;
        fbOne.question = [Math.floor(Math.random() * 6),Math.floor(Math.random() * 6),Math.floor(Math.random() * 6)]

        const fbTwo = new DateFeedBack();
        fbTwo.author = date.personTwo;
        fbTwo.date = date;
        fbTwo.question = [Math.floor(Math.random() * 6),Math.floor(Math.random() * 6),Math.floor(Math.random() * 6)]
        date.feedbackOne = fbOne;
        date.feedbackTwo = fbTwo;
    }
    await event.save()
    res.send(event);
});
module.exports = router;
