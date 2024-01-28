const mongoose=require("mongoose")
const cartSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,


    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"User"
    },
    product:{
      type:mongoose.Schema.Types.ObjectId,
      required:true,
       ref:"Product"
    },
    status:{
        type:String,
        default:"no",
        retuired:true
    }
   
})


const Cart=mongoose.model("Cart",cartSchema);
module.exports=Cart;