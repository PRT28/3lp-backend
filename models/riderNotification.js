const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const RiderNotificationSchema = new Schema({
  orderId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'order',
    require: true
  },
  riderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    require: true
  },
  isAccepted:{
    type:Number,
    default:-1
  }},

{  timestamps:true });

const RiderNotificationModel = model("notification", RiderNotificationSchema);

module.exports = RiderNotificationModel;
