const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activitySchema = new Schema({
    name:{
        type:String,
        require:[true]
    },
    category:{
        type:Schema.Types.ObjectId,
        ref:'CategoryModel',
        required:[true, "An activity must be associated with a categoryModel"]
    }
});
//

const ActivityModel = mongoose.model("activity",activitySchema,"ACTIVITIES");
module.exports = ActivityModel;
