const mongoose = require("mongoose");
const transactionSchema = new mongoose.Schema({
    product:{
        type:
        mongoose.Schema.Types.ObjectId,
        ref:"Product",
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["IN", "OUT"],
        required:true
    }
}, { timestamps:true});
module.exports=mongoose.model("Transaction", transactionSchema);