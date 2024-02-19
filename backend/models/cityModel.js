/**
 * Model for cities
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const citySchema = new Schema({
  name: {
    type: String,
    required: [true, "A cityModel must contain a name"],
  },
  events: {
    type: [Schema.Types.ObjectId],
    ref: "EventModel",
    default: [],
  },
});

const CityModel = mongoose.model("city", citySchema, "CITIES");
module.exports = CityModel;
