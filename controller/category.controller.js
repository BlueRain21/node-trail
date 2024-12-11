import categoryModel from "../model/category.model";
import controllerTryCatch from "../common";

// add category
export const addCategory = async(req,res)=>{
    controllerTryCatch(async()=>{
        console.log("In the add category");
        const {name, description} = req.body;
        console.log(name, description);
        const addData = await categoryModel.create({name, description});
        console.log("added data");

        return res.status(201).json({
            data: addData,
            message: "Category Data Created",
            success: true
        });
        
    }, res);
}


// get all category
export const getCategories = async(req, res)=>{
    controllerTryCatch(async()=>{
        const categoriesData = await categoryModel.find();
        return res.status(200).json({
            data: categoriesData,
            message: "Categories data fetched",
            success: true
        })
    }, res);
}


// get single category
export const getCategory = async(req,res)=>{
    controllerTryCatch(async()=>{
        const categoryid = req.params.categoryid;
        const categoryData = await categoryModel.findOne({"_id": categoryid});
        if(categoryData){
            return res.status(200).json({
                data: categoryData,
                message: "Category data fetched",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Response",
            success: false
        })


    }, res);
}


// update single category
export const updateCategory = async(req,res)=>{
    controllerTryCatch(async()=>{
        const categoryid = req.params.categoryid;
        const {name, description} = req.body;

        const updateData = await categoryModel.updateOne({"_id": categoryid}, {$set: {name, description}});


        if(updateData.modifiedCount > 0){
            return res.status(200).json({
                message: "Category data updated",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Response",
            success: false
        })


    }, res);
}


// delete single category
export const deleteCategory = async(req,res)=>{
    controllerTryCatch(async()=>{
        const categoryid = req.params.categoryid;

        const deleteData = await categoryModel.deleteOne({"_id": categoryid})

        if(deleteData.deletedCount > 0){
            return res.status(200).json({
                message: "Category data deleted",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Response",
            success: false
        })

    }, res);
}