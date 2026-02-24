import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../utils/errorHandler.js";
import { User } from "../models/User.js";
import { sendToken } from "../utils/sendToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import {Course} from "../models/Course.js";
import cloudinary from "cloudinary";
import getDataUri from "../utils/dataUri.js" 
import { Stats } from "../models/Stats.js";

// 1.) REGISTER 


export const register = catchAsyncError(async(req,res,next)=>{

    const {name,email,password} = req.body;

    if(!name || !email || !password ){
        return next(new ErrorHandler("Please enter all fields",400));
    }


    let user= await User.findOne({email});

    if(user)
    {
        return next(new ErrorHandler("User already exists",409));
    }

    const file = req.file;

    if (!file) {
    return next(new ErrorHandler("Poster image is required", 400));
    }


  const fileUri = getDataUri(file);

  const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);


    //upload file on cloudinary;

    user = await User.create({
        name,
        email,
        password,
        avatar : {
            public_id : mycloud.public_id,
            url : mycloud.secure_url,
        },
    });

     sendToken(res,user,"Registered Successfully",201);
 });


//2.) LOG IN

export const login = catchAsyncError(async(req,res,next)=>{

    const {email,password} = req.body;


    if(!email || !password ){
        return next(new ErrorHandler("Please enter all fields",400));
    }


    const user= await User.findOne({email}).select("+password");

    if(!user)
    {
        return next(new ErrorHandler("User does not exist",404));
    }

   

    const isMatched = await user.comparePassword(password);

    if(!isMatched)
    {
        return next(new ErrorHandler("Invalid email or password",401));
    }


    sendToken(res,user,`Welcome back, ${user.name}`,201);
});

// 3.) LOG OUT

export const logout = catchAsyncError(async(req,res,next)=> {

    res.status(200).cookie("token",null,{
        expires : new Date(Date.now()),
        httpOnly : true,
        secure:true,
        sameSite:"none",
    }).json({
        success : true,
        message :"Logged Out successfully",
    });
});


// 4.) Get my profile

export const getMyProfile = catchAsyncError(async(req,res,next)=> {


    const user = await User.findById(req.user._id);

    res.status(200).json({
        success:true,
        user,
       });
});


// 5.) ChangePassword

export const changePassword = catchAsyncError(async(req,res,next)=> {


   const {oldPassword,newPassword}=req.body;

   if(!oldPassword || !newPassword)
   {
     return next(new ErrorHandler("Please enter correct password",400));
   }

   const user = await User.findById(req.user._id).select("+password");

   const isMatched = await user.comparePassword(oldPassword);


   if(!isMatched)
   {
     return next(new ErrorHandler("Incorrect Old Password",400));
   }

   user.password=newPassword;

   await user.save();

    res.status(200).json({
        success:true,
        message:"Password Changed Sucessfully!",
       });
});


// 6.) updateProfile

export const  updateProfile = catchAsyncError(async(req,res,next)=> {


   const {name,email} = req.body;

   const user = await User.findById(req.user._id);


   if(name)
   {
     user.name = name;
   }

   if(email)
   {
     user.email = email;
   }

   await user.save();

    res.status(200).json({
        success:true,
        message:"Profile updated successfully!",
       });
});


// 7 .) update profile picture


export const updateProfilePicture = catchAsyncError(async(req,res,next)=>{
    
    
     const file = req.file;

    if (!file) {
    return next(new ErrorHandler("Poster image is required", 400));
    }

    const user = await User.findById(req.user._id);


   const fileUri = getDataUri(file);

   const mycloud = await cloudinary.v2.uploader.upload(fileUri.content);

   await cloudinary.v2.uploader.destroy(user.avatar.public_id);

   user.avatar = {

    public_id : mycloud.public_id,
    url:       mycloud.secure_url,
   };
   

   await user.save();

    res.status(200).json({
        success:true,
        message:"profile Picture Updated Successfully!"

    });

});


// 8 .) Forgte Password


export const forgetPassword = catchAsyncError(async(req,res,next)=>{
   

    const {email}=req.body;

    const user=await User.findOne({email});

   

    if(!user)
    {
        return next(new ErrorHandler("User not found",400));
    }

    const resetToken = await user.getResetToken();

    await user.save();
   

    const url=`${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
   

    const message=`Click on the link to reset your password.${url}.If you have not request then please ignore.`

    //Send token via email
    await sendEmail(user.email,"CourseHub Reset Password",message);



    res.status(200).json({
        success:true,
        message:`Reset Token has been sent to ${user.email}`,

    });

});


// 9 .) Reset Password


export const resetPassword = catchAsyncError(async(req,res,next)=>{
   
    const {token} = req.params;


     const resetPasswordToken =   crypto
                                  .createHash("sha256")
                                  .update(token)
                                  .digest("hex");


     const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire : {
            $gt:Date.now(),
        },
     });
     
     if(!user)
     {
        return next(new ErrorHandler("Token is invalid or has been expired!"))
     }

     user.password = req.body.password;

     user.resetPasswordExpire=undefined;
     user.resetPasswordToken=undefined;
     

     await user.save();


    

    res.status(200).json({
        success:true,
        message:"Password Chnaged Successfully!",
        

    });

});

// 10.) Add to playlist


export const addToPlaylist = catchAsyncError(async (req,res,next) =>{

    const user=await User.findById(req.user._id);

    const course = await Course.findById(req.body.id);

    if(!course)
    {
        next(new ErrorHandler("Invalid Course Id",404));
    }

    const itemExist = user.playlist.find((item) => {

        if(item.course.toString() === course._id.toString())
        {
            return true;
        }

    });


    if(itemExist)
    {
        return next(new ErrorHandler("Item Already Exist",409));
    }

    user.playlist.push({
        course:course._id,
        poster:course.poster.url,
    });

    await user.save();

    res.status(200).json({
        success:true,
        message:"Added to playlist!",
 

    });
});

//11.) Romev from the playlist

export const removeFromPlaylist = catchAsyncError(async (req,res,next) =>{

    const user=await User.findById(req.user._id);

    const course = await Course.findById(req.query.id);

    if(!course)
    {
        next(new ErrorHandler("Invalid Course Id",404));
    }

    const newPlaylist = user.playlist.filter((item) => {
        if(item.course.toString() !== course._id.toString())
        {
            return item;
        }
    });

    user.playlist = newPlaylist;



    await user.save();

    res.status(200).json({
        success:true,
        message:"Removed  from playlist!",
 

    });
});


//12.)Admin Controllers


export const getAllUsers = catchAsyncError(async (req,res,next) =>{

    const users = await User.find({});

    res.status(200).json({
        success:true,
        users,
 

    });
});


//13.) Upadte the user Role


export const updateUserRole = catchAsyncError(async (req,res,next) =>{

    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler("User not founf",404));
    }

    if(user.role == "user")
    {
        user.role = "admin";
    }
    else
    {
        user.role = "user";
    }    

    await user.save();

    res.status(200).json({
        success:true,
        message:"Role Upadte",
 

    });
});



//14.) Delete User


export const deleteUser = catchAsyncError(async (req,res,next) =>{

    const user = await User.findById(req.params.id);

    if(!user)
    {
        return next(new ErrorHandler("User not founf",404));
    }

    await cloudinary.v2.uploader.destroy(user.avatar.public_id);


    //Cancel Subsequence

    await user.remove();

    res.status(200).json({
        success:true,
        message:"User Deleted Successfully!",
 

    });
});





//15.) Delete my Profile


export const deleteMyProfile = catchAsyncError(async (req,res,next) =>{

    const user = await User.findById(req.user._id);


    await cloudinary.v2.uploader.destroy(user.avatar.public_id);


    //Cancel Subsequence

    await user.remove();

    res
       .status(200)
       .cookie("token",null,{
        expires:new Date(Date.now()),
       })
       .json({
        success:true,
        message:"User Deleted Successfully!",
 

    });
});


//16.)  Admin Dashboard
User.watch().on("change", async () => {
  const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1);

  const subscription = await User.find({ "subscription.status": "active" });
  stats[0].users = await User.countDocuments();
  stats[0].subscription = subscription.length;
  stats[0].createdAt = new Date(Date.now());

  await stats[0].save();
});


