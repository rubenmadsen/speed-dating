/**
 * Model for activities of users
 *
 * activity = Activity under a category
 *
 * Example:
 *
 * Category -> Outdoor
 * Activity -> Running
 *
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const activitySchema = new Schema({
  name: {
    type: String,
    require: [true],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: [true, "An activity must be associated with a categoryModel"],
  },
});

const ActivityModel = mongoose.model("activity", activitySchema, "ACTIVITIES");
module.exports = ActivityModel;
