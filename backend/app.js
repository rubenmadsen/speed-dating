const express = require('express');
const randomGenerations = require('./generate/generateBSData')
const mongoose  = require("mongoose");
const User = require("./models/userModel")
const Event = require('./models/eventModel')
require('dotenv').config();
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose.connect(process.env.DB_SERVER).then(result => {
  app.listen(port,function(){
    console.log("Connected to mongo.");
    console.log("Backend listening in port " + port + "...");
    const newUser = randomGenerations.generateRandomUser();
    User.create(newUser).then(user => {

      console.log("Created",newUser);
    }).catch(err => {
      console.log(err);
    });

    const newEvent = randomGenerations.generateRandomEvent();
    Event.create(newEvent).then(event => {
      console.log("Created new event",event);
    }).catch(err => {
      console.log(err)
    })
  });
});
