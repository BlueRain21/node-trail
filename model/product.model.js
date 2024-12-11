import mongoose from "mongoose";
import categoryModel from "./category.model";
import brandModel from "./brand.model";


const Schema = mongoose.Schema;

const productSchema = new Schema({
    title:{
        type: String,
        require: true
    },
    category: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: categoryModel
    },
    brand : {
        type: Schema.Types.ObjectId,
        require: true,
        ref: brandModel
    },
    price: {
        type: Number,
        require: true
    },
    quantity :{
        type: Number,
        require: true
    },
    shortDescription:{
        type:String,
        default: null
    },
    description: {
        type: String,
        default: null
    },
    thumbnail:{
        type: String,
        default: null
    },
    images: {
        type: Array,
        default: []
    },
    status: {
        type: Number,
        default: 1
    },
    createdAt:{
        type: Date,
        default: Date.now()
    }
})

export default mongoose.model("product", productSchema);