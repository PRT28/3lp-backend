const {
    newOrder
} = require('../controller/order');
const  express = require("express");
const {verifyToken} = require("../config/globals")

const router = express.Router()

router.post('/newOrder', verifyToken, newOrder);

module.exports = router