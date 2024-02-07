const express = require('express');
const randomGenerations = require('./generate/generateBSData')
const mongoose  = require("mongoose");
const User = require("./models/userModel")
const Event = require('./models/eventModel')
const Date = require('./models/dateModel')
const userRoutes = require('./routes/userRoutes')
const eventRoutes = require('./routes/eventRoutes')
const dateRoutes = require('./routes/dateRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const generationRoutes = require('./routes/generationRoutes')
require('dotenv').config();
const app = express();
const port = 3000;
const path = require('path')

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use(userRoutes);
app.use(eventRoutes);
app.use(dateRoutes);
app.use(categoryRoutes);
app.use(generationRoutes);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

mongoose.connect(process.env.DB_SERVER).then(result => {
  app.listen(port,function(){
    console.log("Connected to mongo.");
    console.log("Backend listening in port " + port + "...");
  });
});
