const {
    login,
    register,
    sendOtp,
    checkOtp,
    checkin,
    checkout,
    updateRiderDetails,
    deleteUser
} = require('../controller/auth');
const  express = require("express");

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.delete('/delete', deleteUser)
router.post('/checkin', checkin);
router.patch('/checkout', checkout);
router.post("/rider/updateDetails/:id", updateRiderDetails)
router.get('/sendOtp', sendOtp);
router.get('/checkOtp', checkOtp)

module.exports = router