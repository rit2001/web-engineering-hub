import express from "express";
import { register,
    login,
    logout,
    getMyProfile,
    changePassword,
     updateProfile,
     updateProfilePicture,
     forgetPassword,
      resetPassword,
     addToPlaylist, 
     removeFromPlaylist,
     getAllUsers,
     updateUserRole, 
     deleteUser, 
     deleteMyProfile
    } from "../controllers/userController.js";
import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";
import singleUpload from '../middlewares/multer.js'


const router = express.Router();

//User Registration
router.route("/register").post(singleUpload, register);

//Login User
router.route("/login").post(login);

//Log out
router.route("/logout").get(logout);

//get my profile
router.route("/me").get(isAuthenticated, getMyProfile);

//Delete My Profile
router.route("/me").delete(isAuthenticated,deleteMyProfile);

//ChangePassword
router.route("/changepassword").put(isAuthenticated,changePassword);

//Update Profile
router.route("/updateprofile").put(isAuthenticated,updateProfile);

//update Profile Picure
router.route("/updateprofilepicture").put(isAuthenticated,singleUpload,updateProfilePicture);

//ForgetPassword
router.route("/forgetpassword").post(forgetPassword);

//Reset Password
router.route("/resetpassword/:token").put(resetPassword);

//Add To Playlist
router.route("/addtoplaylist").post(isAuthenticated,addToPlaylist);

//Remove from playlist
router.route("/removefromplaylist").delete(isAuthenticated,removeFromPlaylist);


//Admin Route
router.route("/admin/users").get(isAuthenticated,authorizeAdmin,getAllUsers);

//Upadte Admin Role
router.route("/admin/user/:id").put(isAuthenticated,authorizeAdmin,updateUserRole).delete(isAuthenticated,authorizeAdmin,deleteUser);

//


export default router;