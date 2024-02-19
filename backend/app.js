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

// Routes
const userRoutes = require("./routes/userRoutes");
const eventRoutes = require("./routes/eventRoutes");
const dateRoutes = require("./routes/dateRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const generationRoutes = require("./routes/generationRoutes");
const cityRoutes = require("./routes/cityRoutes");
const activityRoutes = require("./routes/activitityRoute");

// Environment
require("dotenv").config();

const app = express();
const port = 3000;

app.use(cors({ origin: ["http://localhost:4200"], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

app.use(userRoutes);
app.use(eventRoutes);
app.use(dateRoutes);
app.use(categoryRoutes);
app.use(generationRoutes);
app.use(cityRoutes);
app.use(activityRoutes);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/validate-token", authorizeUser, (req, res) => {
  res.status(200).send({ valid: true, user: req.user });
});

mongoose.connect(process.env.DB_SERVER).then((result) => {
  app.listen(port, function () {
    console.log("Connected to mongo.");
    console.log(`Backend listening in port ${port} ...`);
  });
});
