const DateModel = require('../models/dateModel'); // Ensure the variable name does not conflict with global Date
const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const Category = require('../models/categoryModel');
const {compare} = require("bcrypt");

class MatchingAlgorithm {
    males = [];
    females = [];
    dates = [];
    categories = {};

    constructor(event) {
        if (!event)
            console.log("event is null")
        this.males = event.participants.filter(participant => participant.gender === "male");
        this.females = event.participants.filter(participant => participant.gender === "female");
    }
    async loadData(){
        const cats = await Category.find({});

        for (const cat of cats) {
            this.categories[cat._id.toString()] = {score:-1};
        }
        const acts = await Activity.find({});
        for (const act of acts) {
            // this.categories[act.category._id.toString()] = {}
            this.categories[act.category._id.toString()][act._id.toString()] = {malePoints:0, femalePoints:0, score:-2};
        }
        //console.log("Cats",this.categories)
    }

    async pairAll() {
        for (const male of this.males) {
            console.log("MATCHING: " + male.firstname);
            for (const female of this.females) {

                const result = await this.calculateActivityScores(male, female);
                console.log(male.firstname + " & " + female.firstname + " match:\t" + result + " percent")
                console.log(result);
                console.log("")
            }
            console.log("")
        }
    }
    async calculateActivityScores(guy, girl) {
        const activityResults = JSON.parse(JSON.stringify(this.categories));
        const male = await User.findById(guy._id).populate('activityData.activity');
        const female = await User.findById(girl._id).populate('activityData.activity');

        male.activityData.forEach((data) => {
            const categoryID = data.activity.category.toString();
            const activityID = data.activity._id.toString();
            const points = data.points;
            //console.log("cat:" + data.activity.category.toString())
            //console.log("\tact:" + data.activity._id.toString())
            //console.log("\t\tpoints:" + data.points)
            activityResults[categoryID][activityID].malePoints = points;
        })
        female.activityData.forEach((data) => {
            const categoryID = data.activity.category.toString();
            const activityID = data.activity._id.toString();
            const points = data.points;
            //console.log("cat:" + data.activity.category.toString())
            //console.log("\tact:" + data.activity._id.toString())
            //console.log("\t\tpoints:" + data.points)
            activityResults[categoryID][activityID].femalePoints = points;
            activityResults[categoryID][activityID].score = this.#activityPoints(activityResults[categoryID][activityID].malePoints,activityResults[categoryID][activityID].femalePoints);
        })
        Object.keys(activityResults).map(key => {
            const item = activityResults[key];
            const scores = Object.keys(item).reduce((acc, nestedKey) => {
                if (nestedKey !== 'score' && item[nestedKey].hasOwnProperty('score')) {
                    acc.push(item[nestedKey].score);
                }
                return acc;
            }, []);
            activityResults[key].score = this.#aggregateCategory(scores)
            //console.log("scores",scores)
        });
        return activityResults;
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
    #aggregateScore(){

    }
}

module.exports = MatchingAlgorithm; // Export the class itself
