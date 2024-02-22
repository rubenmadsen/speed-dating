/**
 * Routes for events
 */
const { Router, response } = require("express");
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

router.post("/event", authorizeUser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if(user.isOrganizer){
      req.body.organizer = user;
      const result = await Event.create(req.body);
      res.status(201).send(result);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Registration error" });
  }
});

router.get("/event/:eventId/next", function (req, res) {
    console.log("event id", req.params.eventId)
    Event.findById(req.params.eventId).then(async event => {
        const matcher = new MatchingAlgorithm();
        //console.log("Event",event)
        await matcher.loadDataForEvent(event).then();
        matcher.pairAll().then(dates => {
            // console.log("Generated dates for next round")
            res.status(200).send(dates);
        });
    });
});

module.exports = router;
