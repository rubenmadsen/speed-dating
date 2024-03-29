/**
 * Routes for events
 */
const { Router, response, length} = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Event = require("../models/eventModel");
const User = require("../models/userModel");
const City = require("../models/cityModel");
const DateFeedBack = require("../models/dateFeedbackModel");
const Date = require("../models/dateModel");

const MatchingAlgorithm = require("../classes/MatchingAlgorithm");
const events = require("events");

const router = Router();

/**
 * Get all events
 */
router.get("/event", function (req, res) {
  Event.find({})
    .populate("city")
    .populate("participants")
    .then((result) => {
      res.status(200).send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

router.put("/event/:eventId", authorizeUser, async (req, res) => {
    try {
        const {eventId} = req.params;
        const updateData = req.body
        const updatedEvent = await EventModel.findByIdAndUpdate(eventId, updateData, { new: true });
        if (!updatedEvent) {
            return res.status(404).send({ message: 'Event not found' });
        }
        res.status(200).json(updatedEvent);
    } catch (error) {
        res.status(500).send({ message: 'Error updating event', error });
    }

})


/**
 * New event
 */
router.post("/event", authorizeUser, async (req, res) => {
    console.log("req.body",req.body)
  try {
    const user = await User.findById(req.user.id);
    if(user.isOrganizer){
      req.body.organizer = user;


      const city = await City.findById(req.body.city);
      if (!city) {
          return res.status(404).send({ message: "City not found" });
      }

      const newEvent = req.body;
      const r = Math.floor(Math.random() * 12);

      newEvent.imagePath = `venues/venue${r}.jpg`
      const unpopulatedResult = await Event.create(newEvent);
      const populatedResult = await Event.findById(unpopulatedResult._id).populate('city');


      city.events.push(unpopulatedResult._id);
      await city.save();

      user.events.push(populatedResult._id);
      await user.save();
      res.status(201).send(populatedResult);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({ message: "Registration error" });
  }
});
/**
 * Delete an Event
 */
router.delete("/event/:eventId",authorizeUser,function (req,res){
    Event.deleteOne({_id:req.params.eventId}).then(result =>{
       res.send()
    }).catch(err => console.log(err));
});
/**
 * Retrieve a specific event
 */
router.get("/event/:eventId", authorizeUser, async function (req, res) {
    try {
        // Use async/await for consistency and readability
        const event = await Event.findById(req.params.eventId)
            .populate([
                {
                path: 'dates',
                model: 'date',
                populate: [
                    {
                        path: 'personOne',
                        model: 'user'       
                    },
                    {
                        path: 'personTwo',
                        model:'user'
                    },
                    {
                        path: 'feedbackOne',
                        model: 'datefeedback'
                    },
                    {
                        path: 'feedbackTwo',
                        model: 'datefeedback'
                    }
                ]
                },
                {
                path: 'city',
                model: 'city'
                },
                {
                path: 'participants',
                model: 'user'
                }
            ]);
        
        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }
        if (event.round > 3) {
            event.hasEnded = true;
            await event.save();
        }
        res.send(event);
    } catch (err) {
        console.error(err); // It's a good practice to log the error
        res.status(500).send({ message: "An error occurred" });
    }
});
/**
 * Generates the next date round
 */
router.get("/event/:eventId/next",authorizeUser, function (req, res) {
    console.log("event id", req.params.eventId)
    Event.findById(req.params.eventId).then(async event => {
        const matcher = new MatchingAlgorithm();
        console.log("Event",event)
        matcher.loadDataForEvent(event).then(() => {
            matcher.pairAll().then(async dates => {
                for (const dateN in dates) {
                    dates[dateN].personOne = await User.findById(dates[dateN].personOne._id);
                    dates[dateN].personTwo = await User.findById(dates[dateN].personTwo._id);
                }
                res.send(dates)
                console.log("Generated dates for next round")
            });
        });
    });
});

/**
 * Sets the next round of date for the event
 */
router.post("/event/:eventId/setnext",authorizeUser, async function (req, res) {
    const event = await Event.findById(req.params.eventId);

});

// router.get("/event/:eventId", function (req, res) {
//   console.log("event id", req.params.eventId)
//   Event.findById(req.params.eventId).then(async event => {
//
//   });
// });


/**
 * Join an event
 */
router.get("/event/:eventId/join", authorizeUser, async function (req, res) {
    const me = await User.findById(req.user.id);

    Event.findById(req.params.eventId).populate("participants").then( event => {
        console.log("participants:" + event.participants)
        if (event.participants.filter(participant => participant.gender === me.gender).length < 10 && !event.participants.includes(me) && me.isOrganizer === false) {
                event.participants.push(me)
                event.currentParticipants++;
                event.save().then(() => {
                    me.events.push(event)
                    me.save().then(() => {
                        res.status(201).send(event);
                    });
                });
        }
        else{
            res.status(401).send();
        }
    });
});
/**
 * Leave an event
 */
router.get("/event/:eventId/leave", authorizeUser, async function (req, res) {
    try {
        const userId = req.user.id; // Assuming this is correctly populated
        const eventId = req.params.eventId;
        const eventUpdateResult = await Event.updateOne(
            { _id: eventId },
            { $pull: { participants: userId } }
        );
        const userUpdateResult = await User.updateOne(
            { _id: userId },
            { $pull: { events: eventId } } // Assuming the field is named eventsAttended
        );
        if (eventUpdateResult.modifiedCount === 0 || userUpdateResult.modifiedCount === 0) {
            // Handle the case where the updates didn't modify any documents
            return res.status(404).send({ message: "Not found or nothing to remove" });
        }
        Event.findById(eventId).then(event => {
            res.send(event);
        })
    } catch (error) {
        console.error('Error leaving event', error);
        res.status(500).send({ message: "Error leaving the event" });
    }
});

/**
 * Retrieve all x Dates
 */
router.post("/event/stream", function (req, res) {
    let pingpong = req.body;
    pingpong.items = [];
    console.log("ping",pingpong);
    Event.find({})
        .populate("city")
        .populate("participants")
        .skip(pingpong.retrieved)
        .limit(pingpong.amount)
        .then((result) => {
            pingpong.items = result;
            pingpong.retrieved += result.length;
            console.log("pong",pingpong)
            res.status(200).send(pingpong);
        })
        .catch((err) => {
            console.log(err);
        });
});

/**
 * Simulate dates and DateFeedback for an Event
 */
router.get("/event/:eventId/simulatedates", async function (req, res) {
    const event = await Event.findById(req.params.eventId).populate("dates");
    //console.log("event",event)
    if (!event || event.round === 0) {
        res.send({message: "There is no dates to match"});
        return;
    }
    const dates = event.dates.filter(date => date.dateRound === event.round - 1);
    const feedbackPromises = [];
    for (let date of dates) {
        const fbOne = new DateFeedBack({
            author: date.personOne,
            date: date._id,
            question: [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]
        });
        await fbOne.save()
        const fbTwo = new DateFeedBack({
            author: date.personTwo,
            date: date._id,
            question: [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)]
        });
        await fbTwo.save()

        date.feedbackOne = fbOne._id;
        date.feedbackTwo = fbTwo._id;
        await date.save()
        //feedbackPromises.push(Date.updateOne({date._id, feedbackOne:fbOne,feedbackTwo:fbTwo}));
    }

    Event.findById(req.params.eventId)
        .populate({
            path: 'dates', // Populate dates
            populate: [
                { path: 'feedbackOne'
                    }, // Nested populate for feedbackOne
                { path: 'feedbackTwo'
                 }  // Nested populate for feedbackTwo
            ]
        })
        .populate({
            path: 'participants',
            model: 'user' // Ensure this matches the model name you used in mongoose.model
        })
        .then(newEvent => {
            if (!event) {
                return res.status(404).send({ message: 'Event not found' });
            }
            res.send(newEvent);
        })
        .catch(err => {
            console.error(err);
            res.status(500).send({ message: 'Error retrieving event' });
        });
    // const updatedEvent = await Event.findById(event._id).populate("dates");
    // console.log("event after",updatedEvent)
    // res.send(updatedEvent)

});


/**
 * Sets the dates for the current date round of an Event
 */
router.post("/event/:eventId/dates", authorizeUser, async function (req, res) {
    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) {
            return res.status(404).send({ message: "Event not found" });
        }

        const dates = await Date.insertMany(req.body);
        const dateIds = dates.map(date => date._id);

        const updatedEvent = await Event.findByIdAndUpdate(
            req.params.eventId,
            { $push: { dates: { $each: dateIds } }, $inc: { round: 1 } },
            { new: true }
        );

        if (!updatedEvent) {
            return res.status(404).send({ message: "Event not found" });
        }

        // Now you can use await directly without .then()
        const populatedEvent = await Event.findById(updatedEvent._id)
            .populate({
                path: 'participants',
                model: 'user' // Ensure this matches the model name you used in mongoose.model
            })
            .populate('dates'); // Assuming 'dates' is the correct path and you have a corresponding model

        res.status(201).send(populatedEvent);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "An error occurred" });
    }
});



module.exports = router;
