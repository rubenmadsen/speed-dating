const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    startDate:{
        type:Date,
        required:[true, "An event must have a start date"]
    },
    // endDate:{
    //     type:Date,
    //     required:[false, "An event must have an end date"]
    // },
    hasEnded:{
        type:Boolean,
        default:false
    },
    round:{
        type:Number,
        default:0
    },
    location:{
        type:String,
        required:[true, "An event must have a location"],
        maxLength:64
    },
    address:{
        type:String,
        required:[true, "An event must have an address"],
        maxLength:64
    },
    city:{
      type:String,
      required:[true, "An event must have a city"]
    },
    longitude:{
        type:String,
        default:"50.0365° N",
        maxLength:32
    },
    latitude:{
        type:String,
        default:"19.1758° E",
        maxLength:32
    },
    description:{
        type:String,
        required:[true, "An event must have a description"],
        maxLength:1024
    },
    totalParticipants:{
        type:Number,
        default:20
    },
    currentParticipants:{
        type:Number,
        default:0
    },
    participants:{
        type:[Schema.Types.ObjectId],
        ref:'UserModel',
        default:[]
    },
    eventFeedback:{
        type:[Schema.Types.ObjectId],
        ref:'EventFeedbackModel',
        default:[]
    }
});


const EventModel = mongoose.model("event",eventSchema,"EVENTS");
module.exports = EventModel;
