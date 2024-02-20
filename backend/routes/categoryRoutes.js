/**
 * Routes for categories
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Category = require("../models/categoryModel");

const router = Router();

/**
 * Get all categories and activities
 */
router.get("/category", function (req, res) {
  Category.find({})
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
