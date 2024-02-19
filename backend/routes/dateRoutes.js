/**
 * Routes for dates
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Date = require("../models/dateModel");

const router = Router();

router.get("/dates", authorizeUser, function (req, res) {
  Date.find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
