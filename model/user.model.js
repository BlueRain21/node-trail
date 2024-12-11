import mongoose from "mongoose";
import { type } from "os";


const Schema = mongoose.Schema;

const userSchema = new Schema({
    name : {
        type: String,
        require: true
    },
    email :{
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    contact:{
        type: Number,
        default: null
    },
    image:{
        type: String,
        default: null
    },
    otp:{
        type: Number,
        default: null
    },
    status:{
        type:Number,
        default: 1
    },
    createdAt:{
        type: Date,
        default:Date.now()
    }
});

export default mongoose.model("user", userSchema);