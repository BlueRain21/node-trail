import jwt from "jsonwebtoken";
import userModel from "../model/user.model";
import controllerTryCatch from "../common";


export const auth = async(req,res,next) =>{
    controllerTryCatch(async()=>{
        if(req.headers.authorization){
            const token = req.headers.authorization.split(" ")[1];

            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            console.log(decoded);

            const userData = await userModel.findOne({_id: decoded.data.id}).select("-password");
            console.log(userData);

            req.user = userData;

            if(decoded){
                console.log("here");
                next();
            }else{
                return res.status(401).json({
                    message: "Invalid token",
                    success: false
                })
            }
        }else{
            return res.status(401).json({
                message: "Invalid token",
                success: false
            })
        }

        


    }, res);
}