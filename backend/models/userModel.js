const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// const bcrypt = require("bcrypt");

function validate(str){
    return true
}

const userSchema = new Schema({
    imagePath:{
        type:String,
        required:[true, "You must upload a profile image"]
    },
    password:{
        type:String,
        required:[true, "You must enter a password"],
        select:false,
        minlength:[4,"Password needs to be atleast 4 characters long"],
        maxLength:256
    },
    email:{
        type:String,
        required:[true, "You must enter a email address"],
        maxLength:128
    },
    firstname:{
        type:String,
        required:[true, "You must enter a firstname"],
        maxLength:64
    },
    lastname:{
        type:String,
        required:[true, "You must enter a lastname"],
        maxLength:64
    },
    age:{
        type:Number,
        required:[true, "You must enter an age"]
    },
    gender: {
        type:String,
        required:[true, "You must choose a gender"]
    },
    city:{
      type:Schema.Types.ObjectId,
      ref:'cityModel',
      required:[true, "User must contain a city"]
    },
    isOrganizer:{
        type:Boolean,
        default:false
    },
    description:{
        type:String,
        required:[true, "You must tell us about yourself"],
        maxLength:1024
    },
    events:{
        type:[Schema.Types.ObjectId],
        ref:'EventModel',
        default:[]
    },
    sharedContacts:{
        type:[Schema.Types.ObjectId],
        ref:'user',
        default:[]
    },
    preferences:{
        type:[{
            name:{
                type:String
            },
            min:{
                type:Number,
                default:0
            },
            max:{
                type:Number,
                default:1
            }
        }],
        default:[]
    },
    interests: {
        type: [{
            category: {
                type: Number,
                required: true
            },
            activities: {
                type: [String],
                default: []
            }
        }],
        default: []
    },
    matchingData:{
        type:[
            {
                category:{
                    type:Number
                },
                points:{
                    type:Number
                }
            }
        ],
        default:[]
    }
});

// Static method for validating a user
userSchema.statics.login = async function(email,password){
    console.log("entering",email,password)
    const user = await this.findOne({email}).select('+password');
    //console.log("Found user",user)
    if(user){
        const isOK = password === user.password;
        //const isOK = await bcrypt.compare(password,user.password);
        if(isOK){
            console.log("right passwrod");
            return user;
        }
        else{
            console.log("Wrong password");

            throw Error("Wrong password");
        }
    }
    console.log("UserModel no exit");

    throw Error("UserModel does not exist");
}

// // Hooks
// userSchema.pre('save', async function() {
//     const salt = await bcrypt.genSalt();
//     this.password = await bcrypt.hash(this.password,salt);
// });
// userSchema.post('save', function(doc,next) {
//     //console.log("New user saved",doc);
//     next();
// });

const UserModel = mongoose.model("user",userSchema,"USERS");
module.exports = UserModel;
