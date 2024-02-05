const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventFeedbackSchema = new Schema({
    event:{
        type:Schema.Types.ObjectId,
        ref:'EventModel',
        required:[true, "Specify which event this feedback belongs to"]
    },
    feedback:{
        type:String,
        required:[true, "Say somethin"],
        maxLength:256
    },
});


const EventFeedbackModel = mongoose.model("eventfeedback",eventFeedbackSchema,"EVENTFEEDBACK");
module.exports = EventFeedbackModel;
