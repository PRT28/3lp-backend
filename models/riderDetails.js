const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RiderDetailSchema = new Schema({
profileImageUrl:{type:String, required: false}, 
accountNumber:{
    type:String, required: true
},
bankName:{type:String, required: true},
ifscCode:{type:String, required: true},
idprooftype:{type:Number, required: true},
idFrontImgUrl:{type:String, required: true},
idBackImgUrl:{type:String, required: true},
idNumber: {type: Number, required: true},
panUrl:{type:String, required: true},
dlBackUrl:{type:String, required: true},
dlFrontUrl:{type:String, required: true},
riderId:{type: mongoose.Schema.Types.ObjectId, ref:'user'}})

const RiderDetailModel = model("rider_detail", RiderDetailSchema);

module.exports =  RiderDetailModel;