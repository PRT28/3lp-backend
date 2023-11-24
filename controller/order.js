const OrderModel = require("../models/order");




const newOrder= async(req,res)=>{
    try{
        const {
            pickupPoint_address,
            pickupPoint_number,
            delivery_address,
            delivery_number,
            package_type,
            parcel_value,
            pickupCoordinatesX,
             pickupCoordinatesY,
             deliveryCoordinatesX, 
             deliveryCoordinatesY, 
             typeOfVehicle
        } = req.body;
        const user=req.user
        const createNewOrder=new  OrderModel({pickupPoint_address,
            pickupPoint_number,
            delivery_address,
            delivery_number,
            package_type,
            parcel_value,pickupCoordinatesX,
            pickupCoordinatesY,
            deliveryCoordinatesX,
            deliveryCoordinatesY, 
            typeOfVehicle,
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

const getAllOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({});
        res.status(200).json({
            content: {
                orders,
                status: true
            },
            message: 'Orders fetched Successfully'
        })
    } catch(err){
        res.status(500).json({
            content: {
                status: false
            },
            message: `Failed to created orderr! ${err.message}`
        })
    }
}

const test = async (req, res) => {
    console.log(req.files);
    res.status(200).json({
        message: 'temp'
    })
}


module.exports = {
    newOrder,
    test,
    getAllOrders
}