const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const  {vehicleType}  =require("../config/staticData");
const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 2,
    max: 100
  },
  mobile: {
    type: Number,
    required: true,
    unique: true,
  },
  email:{
  type:String,
  },
  password: {
    type: String,
    required: true,
    min: 8,
  },
  checked_in:{
    type: Boolean,
  },
  zip_code:{
    type:String,
    required: true
  },
  user_role: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required:true
  },
  account_type: {
    type: Number
  },
  typeOfVehicle:{
    type: Number,
    enum:vehicleType,
    require: true
  }
},
{ timestamps: true }
);

const UserModel = model("user", UserSchema);

module.exports = UserModel;
