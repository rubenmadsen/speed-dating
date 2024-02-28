// Imports
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const randomGenerations = require("./generate/generateBSData");
const { authorizeUser } = require("./authorization/authorize");
const path = require("path");

// Models
const User = require("./models/userModel");
const Event = require("./models/eventModel");
const Date = require("./models/dateModel");
const City = require("./models/cityModel");

// Routes
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const dateRoutes = require("./routes/dateRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const generationRoutes = require("./routes/generationRoutes");
const cityRoutes = require("./routes/cityRoutes");
const activityRoutes = require("./routes/activitityRoute");
const uploadRoutes = require("./routes/uploadRoute");
const MatchingAlgorithm = require('./classes/MatchingAlgorithm');

// Environment
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors({ origin: ["http://localhost:4200"], credentials: true }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ limit: '5mb', extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(userRoutes);
app.use(eventRoutes);
app.use(dateRoutes);
app.use(categoryRoutes);
app.use(generationRoutes);
app.use(cityRoutes);
app.use(activityRoutes);
app.use(uploadRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/validate-token", authorizeUser, async function (req, res) {
  const user = await User.findById(req.user.id) .populate('city')
  .populate("sharedContacts")
  .populate({
    path: 'events',
    model: 'event',
    populate: [{
      path: 'participants',
      model: 'user'
    },{
      path: 'city',
      model: 'city'
    }
  ]
    }
  )
  .populate({
    path: 'activityData', // Populating activityData
    populate: {
      path: 'activity', // Within each activityData, populate activity
      model: 'activity', // Ensure this matches the name you've used in mongoose.model for your Activity model
      populate: {
        path: 'category', // Within each activity, now populate category
        model: 'category' // Again, ensure this matches the name used in mongoose.model for your Category model
      }
    }
  });;
  if (user) {
    res.status(200).send({ valid: true, user: user , isOrganizer: user.isOrganizer});
  } else {
    res.status(404).send({ valid: false, message: "User not found" });
  }
});



mongoose.connect(process.env.DB_SERVER).then((result) => {
  app.listen(port, function () {
    console.log("Connected to mongo.");
    console.log(`Backend listening in port ${port} ...`);
  });
});
// dolk();
async function dolk (){
  const event = await Event.findOne({}).populate("participants")
  const matcher = new MatchingAlgorithm(event);
  await matcher.loadDataForEvent(event);
  await matcher.pairAll();
}