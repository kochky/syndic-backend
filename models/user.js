const mongoose = require("mongoose")

const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique:true
    },
    password: {
        type: String,
        required: true,
      },
    name: {
        type: String,
        required: true,
    },
    lot: {
        type: Number,
        required: true,
    },
    millieme: {
        type: String,
        required: true,
    },
    provision :{
        type:Array,
        required:true,
        default:[]
    },
    admin: {
        type:Boolean,
        required:true,
        default:false
    }
  },
 

)

module.exports = mongoose.model("User", userSchema)