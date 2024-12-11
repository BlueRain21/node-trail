import { addCategory, getCategories, getCategory, updateCategory, deleteCategory } from "../controller/category.controller";
import express from "express";
import { auth } from "../middleware/auth.middleware";

const route = express.Router();

route.post("/add-category",auth, addCategory);
route.get("/get-categories", getCategories)
route.get("/get-category/:categoryid", getCategory)
route.put("/update-category/:categoryid", updateCategory)
route.delete("/delete-category/:categoryid", deleteCategory)

// check email
// check emial and otp
// change password
// node mailer



export default route;