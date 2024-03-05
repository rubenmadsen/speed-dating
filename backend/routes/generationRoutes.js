/**
 * Routes for generation
 */
const { Router, response } = require("express");
const User = require("../models/userModel");
const Event = require("../models/eventModel");
const EventFeedback = require("../models/eventFeedbackModel");
const DateFeedback = require("../models/dateFeedbackModel");
const Date = require("../models/dateModel");
const { generateDatabase, generateDemo } = require("../generate/generateBSData");

const router = Router();

router.get("/generation/", async function (req, res) {
  generateDatabase(40,20)
    .then(() => {
      generateDemo().then(() => {
        res.status(200).send("Ok");
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send("Epic fail");
    });
});


module.exports = router;
