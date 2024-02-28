/**
 * Routes for cities
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const City = require("../models/cityModel");
const EventModel = require("../models/eventModel");
const CityModel = require("../models/cityModel");

const router = Router();

/**
 * Get all cities
 */
router.get("/city", function (req, res) {
  City.find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.get("/city/:cityId/events", function (req, res) {
  console.log("city id", req.params.cityId)
  CityModel.findById(req.params.cityId).populate({ 
    path: 'events',
    populate: {
      path: 'city',
      model: 'city',
    },
    populate: {
      path: 'participants',
      model: 'user'
    }   
    }).then(city => {
      console.log(city)
      city.events.city = city
      console.log(city)
      res.status(200).send(city.events)
  });
});

module.exports = router;
