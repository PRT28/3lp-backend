const OrderModel = require("../models/order");



const newOrder= async(req,res)=>{
    try{
        const {
            pickupPoint_address,
            pickupPoint_number,
            delivery_address,
            delivery_number,
            package_type,
            parcel_value
        } = req.body;
        const user=req.user
        const createNewOrder=new  OrderModel({pickupPoint_address,
            pickupPoint_number,
            delivery_address,
            delivery_number,
            package_type,
            parcel_value,
            userId:user._id
        })
        await createNewOrder.save()
                    .then(() => {
                        res.status(201).json({
                            content:{
                                status: true
                            },
                            message: 'Order Created Successfully'
                        })
                    })
                    .catch(e => {
                        res.status(500).json({
                            content: {
                                status: false
                            },
                            message: `Failed to created orderr! ${e.message}`
                        })
                    });


    }catch(err){
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to created orderr! ${err.message}`
        })
    }
}


module.exports = {
    newOrder
}