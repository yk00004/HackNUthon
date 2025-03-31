
import mongoose from "mongoose";
const inventoryschema = new mongoose.Schema({
    name:String,
    quntity:Number,
    price:Number,
    ExpDate:{
        type:Date,
        default: () => new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
    },
    life:{
        type:Number,
        default:4*24,
    },
    category:String,
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
});
let Inventtory=mongoose.model("Inventory", inventoryschema);
export default Inventtory; 