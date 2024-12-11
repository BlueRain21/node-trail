import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import userRouter from "./router/user.router";
import brandRouter from "./router/brand.router";
import categoryRouter from "./router/category.router";
import productRouter from "./router/product.router";

const app = express();
const port = process.env.PORT;



var corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:5172"],
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));

app.use(express.json());

app.use("/node-img", express.static("./uploads"));


mongoose.connect(process.env.DB_URL)
  .then(() => console.log('Connected!'));



app.listen(port, ()=>{
    console.log(`Server running on port ${port}`);
})

app.use("/api/v1/", userRouter);
app.use("/api/v1/", brandRouter);
app.use("/api/v1/", categoryRouter);
app.use("/api/v1/", productRouter);