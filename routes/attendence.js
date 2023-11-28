const {
    checkin,
    checkout,calender
} = require('../controller/auth');
const  express = require("express");
const {verifyToken} = require("../config/globals")

const router = express.Router()

router.post('/checkin', verifyToken, checkin);
router.post('/checkout', verifyToken, checkout);
router.get('/calender/:userId', verifyToken, calender);


module.exports = router