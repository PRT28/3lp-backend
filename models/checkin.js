const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const CheckinSchema = new Schema({
  checkin_time: {
    type: Date,
    require: true
  },
  checkout_time: {
    type: Date
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true
  }
},
{ timestamps: true }
);

const CheckinModel = model("checkin", CheckinSchema);

module.exports = CheckinModel;
