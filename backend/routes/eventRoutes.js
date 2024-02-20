/**
 * Routes for events
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Event = require("../models/eventModel");
const User = require("../models/userModel");


const router = Router();

/**
 * Get all events
 */
router.get("/event", async function (req, res) {
  
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
module.exports = router;
