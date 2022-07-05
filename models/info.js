const mongoose = require("mongoose")

const Schema = mongoose.Schema

const infoSchema= new Schema ({
    date:{
        type:String,
        default:new Date(),
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"En attente",
        required:true
    }
})

module.exports = mongoose.model("Info", infoSchema)
