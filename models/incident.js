const mongoose = require("mongoose")

const Schema = mongoose.Schema


const incidentSchema= new Schema ({
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
    },
    messageAdmin:{
        type:String,
        default:"En cours",
        
    }
    
})


module.exports = mongoose.model("Incident", incidentSchema)