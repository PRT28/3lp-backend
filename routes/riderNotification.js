
const  express = require("express");
const {verifyToken} = require("../config/globals");
const { createRiderNotification } = require('../controller/riderNotification');

const router = express.Router()

router.post('/create', verifyToken, createRiderNotification);

module.exports = router