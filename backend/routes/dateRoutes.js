/**
 * Routes for dates
 */
const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const Date = require("../models/dateModel");

const router = Router();

/**
 * Swap tables
 */
router.get("/date/swaptables/:table1Id/:table2Id", authorizeUser, async function (req, res) {
    Date.findById(req.params.table1Id).then(t1 =>{
        Date.findById(req.params.table2Id).then(t2 => {
            const store = t1.tableNumber;
            t1.tableNumber = t2.tableNumber;
            t2.tableNumber = store;
            t1.save().then(() => {
                t2.save().then(() => {
                    res.send();
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});
/**
 * Swap skanks
 */
router.get("/date/swapskanks/:table1Id/:table2Id", authorizeUser, async function (req, res) {
    Date.findById(req.params.table1Id).populate("personOne personTwo").then(t1 =>{
        Date.findById(req.params.table2Id).populate("personOne personTwo").then(t2 => {
            const storedUser = t1.personTwo;
            t1.personTwo = t2.personTwo;
            t2.personTwo = storedUser;
            t1.save().then(() => {
                t2.save().then(() => {
                    res.send();
                }).catch(err => console.log(err));
            }).catch(err => console.log(err));
        }).catch(err => console.log(err));
    }).catch(err => console.log(err));
});
module.exports = router;
