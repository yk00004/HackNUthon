
import mongoose from "mongoose";
import passportlocalmongoose from "passport-local-mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true 
    }
});

userSchema.plugin(passportlocalmongoose);
let User= mongoose.model("User", userSchema);
export default User;
