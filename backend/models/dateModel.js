/**
 * Model for dates
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const dateSchema = new Schema({
  event: {
    type: Schema.Types.ObjectId,
    ref: "event",
    required: [true, "A date must belong to an event"],
    select:false
  },
  tableNumber: {
    type: Number,
    default: 0,
  },
  dateRound: {
    type: Number,
    default: 0,
  },
  percentage: {
    type: Number,
    default: 0,
  },
  personOne: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "A date must contain two participants"],
  },
  personTwo: {
    type: Schema.Types.ObjectId,
    ref: "UserModel",
    required: [true, "A date must contain two participants"],
  },
  feedbackOne: {
    type: Schema.Types.ObjectId,
    ref: "datefeedback",
    default:null
  },
  feedbackTwo:{
    type:Schema.Types.ObjectId,
    ref:"datefeedback",
    default:null
  }
});

const DateModel = mongoose.model("date", dateSchema, "DATES");
module.exports = DateModel;
