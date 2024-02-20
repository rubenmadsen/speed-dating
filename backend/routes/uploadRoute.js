const { Router, response } = require("express");
const { authorizeUser } = require("../authorization/authorize");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const multer = require('multer')
const router = Router();

const Generate = require("../classes/Generate");

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/'); // Destination folder
    },
    filename: function(req, file, cb) {
        const extension = file.originalname.split('.').pop(); // Get file extension
        const fileName = Generate.fileName() + '.' + extension; // Generate new filename
        cb(null, fileName); // Set the file name on the uploaded file
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 5 } // 5MB limit
});
router.post("/upload/image", upload.single('file') ,function (req, res) {
    console.log("file",req.file);
    console.log("new filename",req.file.filename);
    res.status(201).send(req.file);
});
module.exports = router;