const { verifyToken } = require('../config/globals');
const {
    login,
    register,
    sendOtp,
    checkOtp,
    checkin,
    checkout,
    createRiderDetails,
    deleteUser,
    updateRiderDetails,
    getAllUsers
} = require('../controller/auth');
const  express = require("express");

const router = express.Router()

router.post('/login', login);
router.post('/register', register);
router.delete('/delete', deleteUser)
router.post('/checkin', checkin);
router.patch('/checkout', checkout);
router.post("/rider/createRiderDetails/:id", createRiderDetails)
router.post("/rider/updateRiderDetails/:id", updateRiderDetails)
router.get('/sendOtp', sendOtp);
router.get('/checkOtp', checkOtp)
router.get('/', verifyToken, getAllUsers)

module.exports = router