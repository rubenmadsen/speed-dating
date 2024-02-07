const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category:{
        type:Number,
        unique:true,
        required:[true]
    },
    name:{
        type:String,
        require:[true]
    },
    activities:{
        type:[String],
        default:[]
    }
});
//

const CategoryModel = mongoose.model("category",categorySchema,"CATEGORIES");
module.exports = CategoryModel;
