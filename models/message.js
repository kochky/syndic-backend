const mongoose = require("mongoose")

const Schema = mongoose.Schema

const messageSchema= new Schema ({
    date:{
        type:String,
        default:new Date(),
        required:true,
    },
    message:{
        type:String,
        required:true,
    },
    destinataire:{
        type:String,
        required:true
    },
    expediteur:{
        type:String,
        required:true
    },
    lu:{
        type:Boolean,
        default:false,
        required:true
    }

})

module.exports = mongoose.model("Message", messageSchema)
