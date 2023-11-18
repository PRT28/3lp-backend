const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RiderDetailSchema = new Schema({
profileImageUrl:{type:String, required: false}, 
accountNumber:{
    type:String, required: true
},
BankName:{type:String, required: true},
ifscCode:{type:String, required: true},
idprooftype:{type:Number, required: true},
idFrontImgUrl:{type:String, required: true},
idBackImgUrl:{type:String, required: true},
PanUrl:{type:String, required: true},
DlBackUrl:{type:String, required: true},
DlFrontUrl:{type:String, required: true},
riderId:{type: mongoose.Schema.Types.ObjectId, ref:'user'}})

const RiderDetailModel = model("rider_detail", UserSchema);

module.exports =  RiderDetailModel;