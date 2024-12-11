import { addProduct, getProducts, getProductsAggr } from "../controller/product.controller";
import express from "express";

const route = express.Router();

route.post("/add-product", addProduct);
// route.get("/get-products", getProducts);
route.get("/get-products", getProductsAggr);

export default route;