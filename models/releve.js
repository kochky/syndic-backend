const mongoose = require("mongoose")

const Schema = mongoose.Schema

const releveSchema= new Schema ({

    date:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        required:true
    },
    recette: {
        type:Number,
        required:true
    },
    depense: {
        type:Number,
        required:true
    }

})


module.exports = mongoose.model("Releve", releveSchema)