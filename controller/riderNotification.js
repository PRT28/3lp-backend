const RiderNotificationModel = require("../models/riderNotification.js");

const createRiderNotification= async(req,res)=>{
    try{
        const {orderId,riderId}=req.body
        const user=req.user
        if(!user){
            res.status(401).json({ msg: "User does not exist. " });
        }
        newNotification= new RiderNotificationModel({orderId,riderId,isAccepted:-1})
        await newNotification.save().then(() => {
            res.status(201).json({
                content: {
                    status: true
                },
                message: 'Notification Created Successfully'
            })
        })
        .catch(e => {
            res.status(500).json({
                content: {
                    status: false
                },
                message: `Failed to created Notification! ${e.message}`
            })
        })

    }catch(err){
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to get rider details! ${err.message}`
        })
    }
}


module.exports = {
    createRiderNotification
}