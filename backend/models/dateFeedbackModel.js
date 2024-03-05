/**
 * Model for date feedback.
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const dateFeedbackSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "Date feedback must have an author"],
  },
  question:{
    type:[Number],
    default:[]
  }
});

const DateFeedbackModel = mongoose.model(
  "datefeedback",
  dateFeedbackSchema,
  "DATEFEEDBACK"
);
module.exports = DateFeedbackModel;
