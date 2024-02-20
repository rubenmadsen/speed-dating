/**
 * Routes for events
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Event = require("../models/eventModel");
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

module.exports = router;