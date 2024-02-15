const { Router, response}    = require('express');
const { authorizeUser } = require('../authorization/authorize')
const User = require("../models/userModel")
const router = Router()
const jwt = require('jsonwebtoken')

// lazydogs
const DAY = (days) => {
    return days * 24 * 60 * 60;
}
// Create token for user
const createToken = (id) => {
    return jwt.sign({id},"Äldre damer brinner bäst",{
        expiresIn:DAY(3)
    })
}
const handleErrors = (err) => {
    console.log(err.message,err.code);
    let error = {email:"", password:""};
    if(err.message === "Wrong password"){
        error.password = "Incorrect password"
    }
    if(err.message === "User does not exist"){
        error.email = "User does not exist"
    }
    if(err.code === 11000){
        error.email = "Username taken";
        return error;
    }

    if(err.message.includes("user validation failed")){
        console.log(Object.values(err.errors))
        Object.values(err.errors).forEach(({properties}) => {
            console.log(properties);
            error[properties.path] = properties.message;
        })
    }
    return error;
}


/**
 * Get all users
 */
router.get('/user', function (req, res) {
    User.find({}).populate('city').then(result => {
        res.status(200).send(result);
    }).catch(err => {
        console.error(err);
        res.status(500).send("An error occurred while fetching users.");
    });
});

/**
 * Check availability of user email
 * 200 Available
 * 409 Taken
 */
router.get('/user/:email', function (req,res){
    console.log("ekr");
    User.findOne({ email: req.params.email}).then(user => {
        if (user) {
            res.status(409).json({ message: 'Email is already taken.' });
        } else {
            res.status(200).json({ message: 'Email is available.' });
        }
    }).catch(err => {
        console.error(err);
    });
});

/**
 *
 */
router.post('/user/login',async function (req, res) {
    const {email, password} = req.body;
    try {
        const user = await User.login(req.body.email, req.body.password)
        const token = createToken(user._id);
        res.cookie("jwt", token, {httpOnly: true, maxAge: DAY(3) * 1000, sameSite: 'none', secure: true})
        res.cookie("email", email, {httpOnly: true, maxAge: DAY(3) * 1000, sameSite: 'none', secure: true})
        res.status(200).send(user._id);
    } catch (err) {
        const errors = handleErrors(err);
        res.status(400).send(errors)
    }
});

/**
 * Register new user
 * 201 OK
 * 500 Internal server error
 */
router.post('/user', function(req,res){
    User.create(req.body).then(result => {
        res.status(201).send(result)
    }).catch(err => {
        console.log(err)
        req.status(500).send({message:"Registration error"});
    });
});

router.get('/user/:id/contacts', function(req, res){
    User.findById(req.params.id).populate("sharedContacts").then(user => {
        res.status(200).send(user.sharedContacts);
    }).catch(err => {
        console.log(err)
        res.status(500);
    })
});

router.get('/user/:id/preferences', function(req, res){
    console.log(`Finding user ${req.params.id}`)
    User.findById(req.params.id).populate("preferences").then(user => {
        res.status(200).send(user.preferences)
    }).catch(err => {
        console.log(err)
        res.status(500);
    })
});

router.get('/user/:id/interests', function(req, res){
    User.findById(req.params.id).populate("interests").then(user => {
        res.status(200).send(user.interests)
    }).catch(err => {
        console.log(err)
        res.status(500);
    })
});

router.get('/user/:id/matchdata', function(req, res){
    User.findById(req.params.id).populate("matchingData").then(user => {
        res.status(200).send(user.matchingData)
    }).catch(err => {
        console.log(err)
        res.status(500);
    })
});
module.exports = router;