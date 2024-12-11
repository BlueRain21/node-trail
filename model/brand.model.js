import mongoose from "mongoose";
const Schema = mongoose.Schema;

const brandSchema = new Schema({
    name: {
        type: String,
        require: true
    },
    logo: {
        type: String,
        default: null
    },
    status:{
        type: Number,
        default: 1
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model("brand", brandSchema);