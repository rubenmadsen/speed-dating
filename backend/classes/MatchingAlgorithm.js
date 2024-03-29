const Date = require('../models/dateModel'); // Ensure the variable name does not conflict with global Date
const Event = require('../models/eventModel'); // Ensure the variable name does not conflict with global Date
const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const Category = require('../models/categoryModel');
const {compare} = require("bcrypt");

class MatchingAlgorithm {
    males = [];
    females = [];
    dates = [];
    categories = {};
    event = null;
    constructor() {

    }
    async loadDataForEvent(event){
        console.log("Loading data for event")
        this.event = await Event.findById(event._id)
            .populate('dates')
            .populate({
                path: 'participants', // This matches the participants field in your EventModel
                populate: {
                    path: 'activityData.activity', // Nested population for activityData within User model
                    model: 'activity' // Replace 'Activity' with the exact name used in mongoose.model() for ActivityModel
                }
            })
        this.males = this.event.participants.filter(participant => participant.gender === "male");
        this.females = this.event.participants.filter(participant => participant.gender === "female");
        await this.loadCategoriesAndActivities()
    }
    async loadCategoriesAndActivities(){
        const cats = await Category.find({});
        for (const cat of cats) {
            this.categories[cat._id.toString()] = {score:-1};
        }
        const acts = await Activity.find({});
        for (const act of acts) {
            // this.categories[act.category._id.toString()] = {}
            this.categories[act.category._id.toString()][act._id.toString()] = {malePoints:0, femalePoints:0, score:-2};
        }
    }
    async pairAll() {
        console.log("Pairing")
        const dates = [];
        for (const male of this.males) {
            let exclusionList = [];
            if (this.event.round === 2){
                const previousDates = this.event.dates.filter((date) => {
                    return date.dateRound === 1 && date.personOne.toString() === male._id.toString() || date.personTwo.toString() === male._id.toString()
                })
                exclusionList = exclusionList.concat(previousDates)
            }
            if (this.event.round === 3){
                const previousDates = this.event.dates.filter((date) => {
                    return date.dateRound === 2 && date.personOne.toString() === male._id.toString() || date.personTwo.toString() === male._id.toString()
                })
                exclusionList = exclusionList.concat(previousDates)
            }

            const females = this.females.filter(person => {
                return !exclusionList.includes(person);
            });
            let counter = 1;
            for (const female of females) {
                const date = await this.calculateActivityScores(male, female);
                date.tableNumber = counter;
                dates.push(date);
                counter++;
            }
        }
        const selected = this.selectDates(dates)
        // for (const d of selected) {
        //     const createdDate = await Date.create(d);
        //     //this.event.dates.push(createdDate)
        // }
        //this.event.dates.push(...selected);
        //this.event.round++;
        //await this.event.save();
        console.log("Selected len:" + selected.length)
        return selected;
    }
    selectDates(dates){
        console.log("Select best dates")
        let selected = [];
        let last;
        let sorted = dates.sort((a,b) => b.percentage - a.percentage);
        while(sorted.length !== 0){
            last = sorted.shift();
            selected.push(last);
            sorted = sorted.filter(date => {
                return !(date.personOne.toString() === last.personOne.toString() || date.personTwo.toString() === last.personTwo.toString())
            });
        }
        //console.log("Dates:",selected)
        return selected;
    }
    async calculateActivityScores(guy, girl) {
        console.log("Calculate score")
        const activityResults = JSON.parse(JSON.stringify(this.categories));
        const male = guy;
        const female = girl;
        male.activityData.forEach((data) => {
            const categoryID = data.activity.category;
            const activityID = data.activity._id;
            const points = data.points;

            activityResults[categoryID][activityID].malePoints = points;
        })
        female.activityData.forEach((data) => {

            const categoryID = data.activity.category;
            const activityID = data.activity._id;
            const points = data.points;
            activityResults[categoryID][activityID].femalePoints = points;
            activityResults[categoryID][activityID].score = this.#activityPoints(activityResults[categoryID][activityID].malePoints,activityResults[categoryID][activityID].femalePoints);
        })
        let totalScore = 0;
        Object.keys(activityResults).map(key => {
            const item = activityResults[key];
            const scores = Object.keys(item).reduce((acc, nestedKey) => {
                if (nestedKey !== 'score' && item[nestedKey].hasOwnProperty('score')) {
                    acc.push(item[nestedKey].score);
                }
                return acc;
            }, []);
            activityResults[key].score = this.#aggregateCategory(scores)
            totalScore += activityResults[key].score;
            //console.log("scores",scores)
        });
        totalScore = Math.floor(totalScore/5);
        const date = new Date();
        date.event = this.event;
        if (this.event)
            date.dateRound = this.event.round;
        date.tableNumber = 0;
        //date.dateRound = this.event.round + 1;
        date.percentage = totalScore;
        date.personOne = guy;
        date.personTwo = girl;

        //return activityResults;
        if (this.event)
            date.event = this.event;
        return date;
    }


    #activityPoints(malePoints, femalePoints){
        return (1 - ((Math.abs(malePoints - femalePoints))/5));
    }

    #aggregateCategory(valueArray){
        //console.log("keys",valueArray)
        const sum = valueArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / valueArray.length;
        return average * 100;
    }
}

module.exports = MatchingAlgorithm; // Export the class itself
