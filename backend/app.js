const express = require('express');
const mongoose  = require("mongoose");
const User = require("./models/user")
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
    getAllUsers();
  });
});

async function getAllUsers() {
  try {
    const users = await User.find({});
    console.log(users);
  } catch (err) {
    console.error(err);
  }
}