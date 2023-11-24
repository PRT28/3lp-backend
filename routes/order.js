const {
    newOrder,
    test,
    getAllOrders
} = require('../controller/order');
const  express = require("express");
const {verifyToken} = require("../config/globals")

const router = express.Router()

router.post('/newOrder', verifyToken, newOrder);
router.get('/', verifyToken, getAllOrders);
router.post('/test', test);

module.exports = router