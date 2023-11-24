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
const getAssignedOrder=async(req,res)=>{
    try{
        const user=req.user
        if(!user){
            res.status(401).json({ msg: "User does not exist. " });
        }else if(user.user_role!=3)
        {
            res.status(403).json({ msg: "Forbidden. Only available for Rider"});
        }
        
       await RiderNotificationModel.find({riderId:user._id,isAccepted:-1}).then((list) => {
        res.status(201).json({
            content: {
                status: true,
                data:list.json()
            },
            message: 'Assigned order fetched successfully'
        })
    })
    .catch(e => {
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to fetch assigned Order! ${e.message}`
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
const getUserNotificationSummary=async(req,res)=>{
    try{
        const user=req.user
        if(!user){
            res.status(401).json({ msg: "User does not exist. " });
        }else if(user.user_role!=3)
        {
            res.status(403).json({ msg: "Forbidden. Only available for Rider"});
        }
        
        let skippedOrderList=await RiderNotificationModel.find({riderId:user._id,isAccepted:0})
        let AcceptedOrderList=await RiderNotificationModel.find({riderId:user._id,isAccepted:1})
        res.status(200).json({
            content: {
                status: true,
                list:{skippedOrderList,AcceptedOrderList}
                
            },
            message: 'Success!'
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

const skipOrder=async(req,res)=>{
    try{
       const {notificationId}=req.params
        const user=req.user
        if(!user){
            res.status(401).json({ msg: "User does not exist. " });
        }else if(user.user_role!=3)
        {
            res.status(403).json({ msg: "Forbidden. Only available for Rider"});
        }
        
       await RiderNotificationModel.findByIdAndUpdate(notificationId,{isAccepted:0}).then((list) => {
        res.status(201).json({
            content: {
                status: true,
                data:list.json()
            },
            message: 'Skipped Successfully'
        })
    })
    .catch(e => {
        res.status(500).json({
            content: {
                status: false
            },
            message: `unable to skip order Order! ${e.message}`
        })
    })
    }catch(err){
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to skip Order! ${err.message}`
        })
}
}
const acceptOrder=async(req,res)=>{
    try{
       const {notificationId}=req.params
        const user=req.user
        if(!user){
            res.status(401).json({ msg: "User does not exist. " });
        }else if(user.user_role!=3)
        {
            res.status(403).json({ msg: "Forbidden. Only available for Rider"});
        }
        
       await RiderNotificationModel.findByIdAndUpdate(notificationId,{isAccepted:1}).then((list) => {
        res.status(201).json({
            content: {
                status: true,
                data:list.json()
            },
            message: 'Accepted Successfully'
        })
    })
    .catch(e => {
        res.status(500).json({
            content: {
                status: false
            },
            message: `unable to accept Order! ${e.message}`
        })
    })
    }catch(err){
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to accept Order! ${err.message}`
        })
}
}

module.exports = {
    createRiderNotification,
    acceptOrder,
    skipOrder,
    getAssignedOrder,
    getUserNotificationSummary
}