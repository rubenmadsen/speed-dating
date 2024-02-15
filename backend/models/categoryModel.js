const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name:{
        type:String,
        require:[true]
    }
});
//

const CategoryModel = mongoose.model("category",categorySchema,"CATEGORIES");
module.exports = CategoryModel;
