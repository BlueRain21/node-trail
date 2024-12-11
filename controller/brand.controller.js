import brandModel from "../model/brand.model";
import controllerTryCatch from "../common";
import multer from "multer";
import fs from "fs";
import path from "path";


// multer diskStorage - Start
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // if destination folder exists or not
        if(!fs.existsSync("./uploads")){
            fs.mkdirSync("./uploads");
        }
        // creating the destination folder
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
        // reading file name
        const orgName = file.originalname;
        const name = path.parse(orgName).name;
        const ext = path.parse(orgName).ext;
        const unique = Date.now();
      cb(null, name+"-"+unique+ext);
    }
  })
  
  //instance of multer
  const upload = multer({ storage: storage })

// multer diskStorage - End








// add brand
export const addBrand = async(req, res)=>{
    controllerTryCatch(async()=>{

        // 
        const fileWithData = upload.single('logo');
        fileWithData(req, res, async function(err){
            if(err) return res.status(400).json({message: err.message, success: false})

                // to access the file in formData
                console.log(res.file)

                // to access the text in formData
                console.log(res.body)

            const {name} = req.body;

            // checking if the file is uploaded or not
            const img = req.file? req.file.filename : null;

        const addData = await brandModel.create({name, logo: img});
        return res.status(201).json({
            data: addData,
            message: "Brand added successfully",
            success: true
        })
        })

    }, res);
}



// get all brand
export const getBrands = async(req, res)=>{
    controllerTryCatch(async()=>{
        const brandsData = await brandModel.find();
        return res.status(200).json({
            data: brandsData,
            filepath: "http://localhost:8001/node-img",
            message: "Brands data fetched",
            success: true
        })
    }, res);
}


// get single brand
export const getBrand = async(req, res)=>{
    controllerTryCatch(async()=>{
        const brandid = req.params.brandid;
        console.log(brandid);
        const brandData = await brandModel.findOne({"_id": brandid});
        console.log(brandData);
        if(brandData){
            return res.status(200).json({
                data: brandData,
                filepath: "http://localhost:8001/node-img",
                message: "Brand Data Fetched",
                success: true
            })
        }
        return res.status(400).json({
            message: "Bad Request",
            success: false
        })
    }, res);
}




// update single brand
export const updateBrand = async(req, res)=>{
    controllerTryCatch(async()=>{
        const updateWithData = upload.single("logo");

        updateWithData(req,res, async function(err){
            if(err) return res.status(400).json({message: err.message, success: false})

            // console.log(res.file);
            // console.log(res.body);


        const brandid = req.params.brandid;
        const {name} = req.body;

        const logoData = await brandModel.findOne({_id: brandid});

        const img = req.file ? req.file.filename : logoData.logo;

        if(req.file){
            if(fs.existsSync("./uploads/"+logoData.logo)){
                fs.unlinkSync("./uploads/"+logoData.logo)
            }
        }

        const updateData = await brandModel.updateOne({"_id":brandid}, {$set:{name, logo: img}});

        if(updateData.modifiedCount >0){
            return res.status(200).json({
                message: "Brand Data Updated Successfully",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad request",
            success: false
        })
        })

    }, res);
}





// delete single brand
export const deleteBrand = async(req, res)=>{
    controllerTryCatch(async()=>{
        const brandid = req.params.brandid;

        const brandData = await brandModel.findOne({_id: brandid});


        const deleteData = await brandModel.deleteOne({"_id": brandid});

        
        if(deleteData.deletedCount >0){
            if(fs.existsSync("./uploads/"+ brandData.logo)){
                fs.unlinkSync("./uploads/"+ brandData.logo)
            }

            return res.status(200).json({
                message: "Brand deleted successfully",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Request",
            success: false
        })

    }, res);
}