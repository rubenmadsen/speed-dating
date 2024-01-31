const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");

function validate(str){
    return true
}

const userSchema = new Schema({
    username:{
        type:String,
        required:[true, "You must enter a username"],
        unique:[true, "Username already exists"],
        lowercase:true,
        minlength:[4,"Username needs to be atleast 4 characters long"],
        validate:[(val) => { validate(val) }, "Use only a-z and 0-9"]
    },
    password:{
        type:String,
        required:[true, "You must enter a password"],
        minlength:[4,"Password needs to be atleast 4 characters long"]
    }
});
//
// // Static method for validating a user
// userSchema.statics.login = async function(username,password){
//     const user = await this.findOne({username});
//     if(user){
//         const isOK = await bcrypt.compare(password,user.password)
//         if(isOK){
//             // Password matches
//             return user;
//         }
//         else{
//             // Wrong password
//             throw Error("Wrong password")
//         }
//     }
//     throw Error("User does not exist");
// }

// // Hooks
// userSchema.pre('save', async function() {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password,salt);
// });
// userSchema.post('save', function(doc,next) {
//     //console.log("New user saved",doc);
//     next();
// });

const User = mongoose.model("user",userSchema,"USERS");
module.exports = User;
