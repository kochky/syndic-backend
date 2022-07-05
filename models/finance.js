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

const financeSchema= new Schema (
    {   year: {
            type:Number,
            required:true,
            unique:true
        },
        solde:{
            type:Number,
            required:true,
            default:0
        },
        actuel:{
            type:Number,
            required:true,
            default:0

        },
        releve:{
            type:[releveSchema],
            default:[]

        }
    }
)

module.exports = mongoose.model("Finance", financeSchema)