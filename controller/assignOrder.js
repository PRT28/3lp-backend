const OrderModel = require("../models/order.js");
const User= require("../models/user.js");



const getRider= async(req,res)=>{
    try{
        const {orderId}=req.query
        console.log("order :",orderId)
        const user=req.user
        const orderDetails = await OrderModel.findById(orderId);
        console.log(orderDetails)
        typeOfVehicle=orderDetails.typeOfVehicle
        
        availableRiders=await User.find({user_role:3,typeOfVehicle,checked_in:true}).limit(10)
        if(availableRiders.length)
        {
            res.status(200).json({
                content:{
                    status: true,
                    riderdetails:availableRiders
                },
                message: 'list of available rider'
            })
        }
        else{
            res.status(404).json({
                content:{
                    status: false,
                },
                message: 'No rider available right now'
            })
        }

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
    getRider
}