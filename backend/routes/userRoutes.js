const { Router, response}    = require('express');
const { authorizeUser } = require('../authorization/authorize')
const { User } = require("../models/userModel")
const router = Router()


router.post('/available', function (req,res){
    User.findOne({ where: { email: req.body.email } }).then(user => {
        if (user) {
            res.status(409).json({ message: 'Email is already taken.' });
        } else {
            res.status(200).json({ message: 'Email is available.' });
        }
    }).catch(err => {
        console.error(err);
    });
});

router.post('/register', function(req,res){
    User.create(req.body).then(result => {
        res.status(201).send(result)
    }).catch(err => {
        console.log(err)
        req.status(500).send({message:"Registration error"});
    });
});