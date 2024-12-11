import userModel from "../model/user.model";
import controllerTryCatch from "../common";
import bcript from "bcrypt";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";

// Add user
export const addUser = async(req, res)=>{
    controllerTryCatch(async()=>{
        const data = req.body;
        const {name, email, password, contact, image} = req.body;
        const hashPassword = bcript.hashSync(password, 10);
        // console.log(hashPassword);

        console.log(email);
        const existingUser = await userModel.findOne({email: email});
        console.log(existingUser);

        if(existingUser){
            return res.status(400).json({
                message: "User already exists",
                success: false
            })
        }
        
        const created = await userModel.create({name, email, password: hashPassword, contact, image})

        return res.status(201).json({
            message: "User created",
            data: created,
            success: true
        })
    }, res); 
}



// Get all users
export const getUsers = async (req, res)=>{
    controllerTryCatch(async()=>{
        const userData = await userModel.find();
        return res.status(200).json({
            data: userData,
            message: "All user data fetched",
            success: true
        })
    }, res);
}



// get single user
export const getUser = async(req, res)=>{
    controllerTryCatch(async()=>{
        const userid = req.params.userid;
        const userData = await userModel.findOne({"_id": userid});
        if(userData){
            return res.status(200).json({
                data: userData,
                message: "Single User Data Fetched",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad request",
            success: false
        })

    }, res);
}



// update single user 
export const updateUser = async(req, res)=>{
    controllerTryCatch(async()=>{
        const userid = req.params.userid;
        const {name, email, password, contact, image} = req.body;

        const updateDate = await userModel.updateOne({_id: userid}, {$set:{
            name, email, password, contact, image
        }});

        if(updateDate.modifiedCount > 0){
            return res.status(200).json({
                message: "User Data Updated",
                success: true
            })
        }

        return res.status(400).json({
            message: "Something went wrong...",
            success: false
        })


    }, res);
}



// delete user
export const deleteUser = async(req, res)=>{
    controllerTryCatch(async()=>{
        const userid = req.params.userid;
        const deleteData = await userModel.deleteOne({_id: userid});
        console.log(userid);
        console.log(deleteData);
        if(deleteData.deletedCount > 0){
            return res.status(200).json({
                message: "User data deleted successfully",
                success: true
            })
        }

        return res.status(400).json({
            message: "Bad Request",
            success: false
        })

    }, res);
}




// login
export const login = async(req, res)=>{
    controllerTryCatch(async()=>{
        const {email, password} = req.body;

        const existingUser = await userModel.find({"email": email});

        if(!existingUser){
            return res.status(400).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        const pass = bcript.hashSync(password, 10);
        const compare = bcript.compare(pass, existingUser.password);

        if(!compare){
            return res.status(400).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        return res.status(200).json({
            message: "Login successful",
            success: true
        })

    }, res);
}



// generate otp
export const generateOTP = async(req,res)=>{
    try{
  
      const {email} = req.body;
  
      const existingUser = await userModel.findOne({email: email});
  
      if(!existingUser){
        return res.status(400).json({
          message: "User does not exits",
          success: false
        })
      }
  
  
      // const otp = Math.floor(Math.random()*1000);
  
      let otp = Math.floor(Math.random()*10000);
      
      while(otp<1000 || otp>9999){
          otp = Math.floor(Math.random()*10000);
      }
  
      const transporter = nodemailer.createTransport({
        service:"gmail",
        auth: {
          user: "neha.trycatch@gmail.com",
          pass: "rlod avsu grff fkcg",
        },
      });
  
      const info = await transporter.sendMail({
        from: 'neha.trycatch@gmail.com', // sender address
        to: email, // list of receivers
        subject: "OTP Verification", // Subject line
        text: `your OTP is ${otp}`, // plain text body
      });
  
  
      const updateOtp = await userModel.updateOne({"_id": existingUser._id}, {$set: {otp:otp}});
  
      if(updateOtp.modifiedCount> 0){
        return res.status(200).json({
          message: "OTP Generated successfully",
          success: true
        })
      }

  
    }catch(error){
      return res.status(500).json({
        message: error.message,
        success: false
      })
    }
  }
  
  
  // verify otp
  export const verifyOtp = async(req, res)=>{
    try{
  
      const {email, otp} = req.body;
  
      const existingUser = await userModel.findOne({email: email});
  
      if(!existingUser){
        return res.status(400).json({
          message: "User does not exits",
          success: false
        })
      }
  
      if(existingUser.otp !== otp){
        return res.status(401).json({
          message: "OTP does not matches",
          success: false
        })
      }
  
      const updateChangePassword = await userModel.updateOne({_id: existingUser._id}, {$set:{
        changePassword: true
      }});
  
  
      if(updateChangePassword.modifiedCount> 0){
        return res.status(200).json({
          message: "User can create new password",
          success: true
        })
      }
  
      return res.status(400).json({
        message: "Bad request",
        success: false
      })
  
  
    }catch(error){
      return res.status(500).json({
        message: error.message,
        success: false
      })
    }
  }
  
  
  
  // change password
  export const changePassword = async(req, res)=>{
    try{
      const {password, email, otp} = req.body;
  
      const existingUser = await userModel.findOne({email: email});
  
      if(!existingUser){
        return res.status(400).json({
          message: "User does not exits",
          success: false
        })
      }
  
      if(!existingUser.changePassword){
        return res.status(400).json({
          message: "User does not have the permission to change password",
          success: false
        })
      }
  
      const hashPassword = bcrypt.hashSync(password, 10);
  
      const changeData = await userModel.updateOne({_id: existingUser._id}, {$set:{password: hashPassword, changePassword: false}});
  
      if(changeData.modifiedCount>0){
        return res.status(200).json({
          message: "Password changed successfully",
          success: true
        })
      }
  
      return res.status(400).json({
        message: "Something went wrong",
        success: false
      })
  
  
    }catch(error){
      res.status(500).json({
        message: error.message,
        success: false
      })
    }
  }
  


  // Login with otp

  export const loginWithOtp = async(req,res)=>{
    controllerTryCatch(async()=>{
      const {email} = req.body;

      const existingUser = await userModel.findOne({email: email});

      if(!existingUser){
        return res.status(400).json({
          message: "User does not exits",
          success: false
        })
      }

      let otp = Math.floor(Math.random()* 10000);

      while(otp<1000 || otp>9999){
        otp = Math.floor(Math.random()* 10000);
      }

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "neha.trycatch@gmail.com",
          pass: "rlod avsu grff fkcg",
        }
      });

      const info = await transporter.sendMail({
        from: "neha.tryatch@gmail.com",
        to: email,
        subject : "OTP Verification for Node Revision",
        text: `Enter the following OTP ${otp}`
      });

      console.log(existingUser);
      const updateOtp = await userModel.updateOne({
        "_id": existingUser._id
      },{
        $set:{otp: otp}
      });

      console.log(updateOtp.modifiedCount);
      console.log(updateOtp.modifiedCount>0);

      if(updateOtp.modifiedCount > 0){
        console.log("here");
        return res.status(200).json({
          message: "OTP generated successfully for Login",
          success: true
        })
      }


      return res.status(400).json({
        message: "Something went wrong",
        success: false
      })

    }, res);
  }




  // verify login with otp

  export const verifyLoginOtp = async(req,res)=>{
    controllerTryCatch(async()=>{
      const {email, otp} = req.body;

      const existingUser = await userModel.findOne({email: email});

      if(!existingUser){
        return res.status(400).json({
          message: "User not found",
          success: false
        })
      }

      if(existingUser.otp !== otp){
        return res.status(400).json({
          message: "OTP does not match",
          success: false
        })
      }

      // token generation
      const token = jwt.sign(
        {
          data: {id: existingUser._id}
        },
        process.env.SECRET_KEY,
        {expiresIn: "1h"}
      )

      return res.status(200).json({
        data: existingUser,
        token: token,
        message: "Login Successful"
      })




    }, res);
  }

  