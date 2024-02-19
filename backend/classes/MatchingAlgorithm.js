const DateModel = require('../models/dateModel'); // Ensure the variable name does not conflict with global Date
const User = require('../models/userModel');
const Activity = require('../models/activityModel');
const Category = require('../models/categoryModel');

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
            this.categories[cat._id.toString()] = [];
        }
        const acts = await Activity.find({});
        for (const act of acts) {
            console.log("act",act)
            this.categories[act.category._id.toString()].push(act._id.toString());
        }
        console.log("Cats",this.categories)
    }
    // Assuming this method will be filled in later
    async pairAll() {
        for (const male of this.males) {
            console.log("MATCHING: " + male.firstname);
            for (const female of this.females) {
                const result = await this.calculateScoreForParticipant(male, female);
                console.log(male.firstname + " & " + female.firstname + " match:\t" + result + " percent")
            }
            console.log("")
        }
    }

    async calculateScoreForParticipant(guy, girl) {
        //console.log("participant",participant.activityData)
        const cats = await Category.find({});
        let catAct = {}; // Initialize as an array
        cats.forEach(cat => {
            catAct[cat._id.toString()] = [];

        });
        //console.log("cats",catAct);
        for (const male_act of guy.activityData) {

            let female_act = girl.activityData.find(activity => {
                return activity.activity._id.toString() === male_act.activity._id.toString();
            });
            const result = 1 - ((male_act.points-female_act.points)/5);
            const activityObj = await Activity.findById(male_act.activity._id);
            // console.log("activityObj",activityObj.category._id)
            catAct[activityObj.category._id.toString()].push(result);
        }
        //console.log("catact",catAct)
        const results = [];
        let total = 0;
        Object.values(catAct).forEach((value) => {
            total += this.#aggregateCategory(value);
        });
        total /= 5;
        return total;
    }
    #aggregateCategory(valueArray){
        //console.log("keys",valueArray)
        const sum = valueArray.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / valueArray.length;
        return average; //* 100;
    }
}

module.exports = MatchingAlgorithm; // Export the class itself
