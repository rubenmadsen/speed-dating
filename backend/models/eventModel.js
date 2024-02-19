/**
 * Model for events
 */
const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const eventSchema = new Schema({
  startDate: {
    type: Date,
    required: [true, "An event must have a start date"],
  },
  hasEnded: {
    type: Boolean,
    default: false,
  },
  floorPlan: {
    type: String,
    default: "",
  },
  round: {
    type: Number,
    default: 0,
  },
  location: {
    type: String,
    required: [true, "An event must have a location"],
    maxLength: 64,
  },
  address: {
    type: String,
    required: [true, "An event must have an address"],
    maxLength: 64,
  },
  city: {
    type: Schema.Types.ObjectId,
    ref: "city",
    required: [true, "An event must have a city"],
  },
  description: {
    type: String,
    required: [true, "An event must have a description"],
    maxLength: 1024,
  },
  totalParticipants: {
    type: Number,
    default: 20,
  },
  currentParticipants: {
    type: Number,
    default: 0,
  },
  participants: {
    type: [Schema.Types.ObjectId],
    ref: "user",
    default: [],
  },
  eventFeedback: {
    type: [Schema.Types.ObjectId],
    ref: "EventFeedbackModel",
    default: [],
  },
});

const EventModel = mongoose.model("event", eventSchema, "EVENTS");
module.exports = EventModel;
