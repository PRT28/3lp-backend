
const  express = require("express");
const {verifyToken} = require("../config/globals");
const { createRiderNotification,getAssignedOrder,skipOrder,acceptOrder, getUserNotificationSummary } = require('../controller/riderNotification');

const router = express.Router()

router.post('/create', verifyToken, createRiderNotification);
router.get('/getAssignedOrder', verifyToken, getAssignedOrder);
router.get('/getusersummary', verifyToken, getUserNotificationSummary);
router.patch('/skip/:id', verifyToken, skipOrder);
router.patch('/accept/:id', verifyToken, acceptOrder);

module.exports = router