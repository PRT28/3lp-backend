const mongoose = require("mongoose");
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
    require: true
  },
  parcel_value: {
    type: Number,
    require: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  }
},
{ timestamps: true }
);

const OrderModel = model("order", OrderSchema);

module.exports = OrderModel;
