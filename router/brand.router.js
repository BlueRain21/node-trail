import express from "express";
import { addBrand, getBrand, getBrands, updateBrand, deleteBrand } from "../controller/brand.controller";

const route = express.Router();

route.post("/add-brand", addBrand);
route.get("/get-brands", getBrands);
route.get("/get-brand/:brandid", getBrand);
route.put("/update-brand/:brandid", updateBrand);
route.delete("/delete-brand/:brandid", deleteBrand);
  
export default route;