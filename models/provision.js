const mongoose = require("mongoose")

const Schema = mongoose.Schema

const provisionSchema = new Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    montant: {
        type: Number,
        required: true,
    },
    paid: {
        type: Boolean,
        required: true,
        default:false,
    },
  },
 

)

module.exports = mongoose.model("Provision", provisionSchema)