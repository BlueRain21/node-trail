import productModel from "../model/product.model";
import controllerTryCatch from "../common";
import multer from "multer";
import fs from "fs";
import path from "path";

// multer diskStorage - Start
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        // Checking if destination folder exits or not
        if(!fs.existsSync("./uploads/product")){
            fs.mkdirSync("./uploads/product")
        }
        // Creating the destination folder
        cb(null, "./uploads/product");
    },
    filename: function (req, file, cb){
        // Reading the filename
        const orgName = file.originalname;
        const name = path.parse(orgName).name;
        const ext = path.parse(orgName).ext;
        const unique = Date.now();
        // Creating the new name for the image
        cb(null, name+"-"+unique+ext);
    }
});

// Instance of multer
const upload = multer({storage: storage});
// multer diskStorage - End






// addProduct
export const addProduct = async(req,res)=>{
    controllerTryCatch(async()=>{


        const fileWithData = upload.fields([
            {
                name: 'thumbnail',
                maxCount: 1
            },
            {
                name: "images",
                maxCount: 5
            }
        ])


        fileWithData(req, res, async(err)=>{

            if(err){
                return res.status(400).json({
                    message: err.message,
                    success: false
                });
            }



            // accessing file in formdata
            console.log(req.files);

            // accessing text in formdata
            console.log(req.body);

            const thumbnail = req.files["thumbnail"]? req.files["thumbnail"][0].filename: null;

            const images = req.files["images"]?
            req.files["images"].map(e=> e.filename): [];

            const {title, category, brand, price, quantity, shortDescription, description} = req.body;


        const addedData = await productModel.create({title , category, brand, price, quantity, shortDescription,description, thumbnail, images});
        return res.status(201).json({
            data: addedData,
            message: "Product added Successfully",
            success: true

        })

        })



        
    }, res);
}


// get product
export const getProducts = async(req,res)=>{

    const {limit, page, search, sort} = req.query;
    const skip = limit * (page-1);


    let filter = {};
    if(search){
        const rgx = (x)=>{
            return new RegExp(`.*${x}.*`)
        }

        const serarchRgx = rgx(search);
        filter = {
            $or:[
                {title: {$regex: serarchRgx, $options: "i"}},
                {shortDescription: {$regex: serarchRgx, $options: "i"}},
                {description: {$regex: serarchRgx, $options: "i"}}
            ]
        }
    }


    // sort 
    // let sortValue = {_id:1}
    // switch(sort){
    //     case "na":
    //         sortValue = {_id: -1};
    //         break;
    //     case "htl":
    //         sortValue=  {price: -1};
    //         break;
    //     case "lth":
    //         sortValue = {price: 1};
    //         break;
    // }

    let sortvalue = {_id:1}
        if(sort === 'na'){
            sortvalue = {_id:-1}
        }
        if(sort === 'htl'){
            sortvalue = {price:-1}
        }
        if(sort === 'lth'){
            sortvalue = {price:1}
        }

    controllerTryCatch(async()=>{
        const productData = await productModel.find(filter).populate("brand", "name").populate("category", "name").limit(limit).skip(skip).sort(sortvalue);


        return res.status(200).json({
            data: productData,
            count: productData.length,
            message: "Product data fetched",
            success: true
        })

    }, res);
}




export const getProductsAggr = async(req,res)=>{
    try{

        const productData = await productModel.aggregate([
            {
                $lookup:{
                    from:'categories',      //database name
                    localField:'category',  //key name in product database
                    foreignField:'_id',     //key name in category database
                    as: 'categoryData'
                }
            },
            {
                $unwind:"$categoryData"
            },
            {
                $lookup:{
                    from:'brands',
                    localField:'brand',
                    foreignField:'_id',
                    as: 'brandData'
                }
            },
            {
                $unwind:"$brandData"
            }
        ]); 


        return res.status(200).json({
            data:productData,
            massage:"products Fetched",
            success:true,
        })
    }catch(error){
        return res.status(500).json({massage:error.massage, success:false})
    }

}