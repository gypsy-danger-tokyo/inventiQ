const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({//what fields should a product have
    name:{
        type:String, 
        required:true
    },
    quantity:{
        type:Number, 
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String, 
        required:true
    },
},
{
    timestamps:true //created at/updated at
}
);
module.exports = mongoose.model("Product", productSchema);