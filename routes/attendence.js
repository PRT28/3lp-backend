const {
    checkin,
    checkout
} = require('../controller/auth');
const  express = require("express");
const {verifyToken} = require("../config/globals")

const router = express.Router()

router.post('/checkin', verifyToken, checkin);
router.post('/checkout', verifyToken, checkout);

module.exports = router