const {
    login,
    register,
    sendOtp,
    checkOtp,
    checkin,
    checkout
} = require('../controller/auth');
const  express = require("express");

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.post('/checkin', register);
router.patch('/checkout', register);
router.get('/sendOtp', sendOtp);
router.get('/checkOtp', checkOtp)

module.exports = router