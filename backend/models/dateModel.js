const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dateSchema = new Schema({
    personOne:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
        required:[true, "A date must contain two participants"]
    },
    personTwo:{
        type:Schema.Types.ObjectId,
        ref:'UserModel',
        required:[true, "A date must contain two participants"]
    },
    feedback:{
        type:[Schema.Types.ObjectId],
        ref:'DateFeedbackModel'
    }
});


const DateModel = mongoose.model("date",dateSchema,"DATES");
module.exports = DateModel;
