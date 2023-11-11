const {
    login,
    register,
    sendOtp,
    checkOtp
} = require('../controller/auth');
const  express = require("express");

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.get('/sendOtp', sendOtp);
router.get('/checkOtp', checkOtp)

module.exports = router