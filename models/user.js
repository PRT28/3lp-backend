const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    min: 2,
    max: 100,
    unique: true,
  },
  mobile: {
    type: Number,
    required: true,
    max: 15,
    unique: true,
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
  }
},
{ timestamps: true }
);

const UserModel = model("user", UserSchema);

module.exports = UserModel;
