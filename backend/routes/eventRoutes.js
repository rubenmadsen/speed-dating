/**
 * Routes for events
 */
const { Router, response, length} = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Event = require("../models/eventModel");
const User = require("../models/userModel");

const MatchingAlgorithm = require("../classes/MatchingAlgorithm");

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

      const unpopulatedResult = await Event.create(req.body);
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
router.get("/event/:eventId/next", function (req, res) {
    console.log("event id", req.params.eventId)
    Event.findById(req.params.eventId).then(async event => {
        const matcher = new MatchingAlgorithm();
        console.log("Event",event)
        await matcher.loadDataForEvent(event).then();
        matcher.pairAll().then(dates => {
            console.log("Generated dates for next round")
            res.status(200).send(dates);
        });
    });
});

router.get("/event/:eventId", function (req, res) {
  console.log("event id", req.params.eventId)
  Event.findById(req.params.eventId).then(async event => {
      
  });
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
module.exports = router;
