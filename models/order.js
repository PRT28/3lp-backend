const mongoose = require("mongoose");
import { packageType, vehicleType } from "../config/staticData";
const { Schema, model } = mongoose;

const OrderSchema = new Schema({
  pickupPoint_address: {
    type: String,
    require: true
  },
  pickupPoint_phone: {
    type: String,
    require: true
  },
  deliveryPoint_address: {
    type: String,
    require: true
  },
  deliveryPoint_phone: {
    type: String,
    require: true
  },
  package_type: {
    type: String,
    enum:packageType,
    require: true
  },
  parcel_value: {
    type: Number,
    require: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  },


  pickupCoordinatesX:{
    type: Number,
    require: true
  }, 
  pickupCoordinatesY:{
    type: Number,
    require: true
  }, 
  deliveryCoordinatesX:{
    type: Number,
    require: true
  },
   deliveryCoordinatesY:{
    type: Number,
    require: true
  }, typeOfVehicle:{
    type: String,
    enum:vehicleType,
    require: true
  }},

{  timestamps:true });

const OrderModel = model("order", OrderSchema);

module.exports = OrderModel;
