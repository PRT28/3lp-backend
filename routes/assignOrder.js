const {
    getRider
} = require('../controller/assignOrder');
const  express = require("express");
const {verifyToken} = require("../config/globals")

const router = express.Router()

router.get('/getrider', verifyToken, getRider);

module.exports = router