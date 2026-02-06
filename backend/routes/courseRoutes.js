import express from 'express';
import { getAllCourses,createCourse,getCourseLectures,addLecture,deleteCourse,deleteLecture } from '../controllers/courseController.js';
import singleUpload from '../middlewares/multer.js';
import {
  authorizeAdmin,
  isAuthenticated,
  authorizeSubscribers,
} from "../middlewares/auth.js";


const router = express.Router();

//Get all courses without lectures
router.route("/courses").get(getAllCourses);

//Create new course -> only admin
router
      .route("/createcourse")
      .post(isAuthenticated, authorizeAdmin,singleUpload,createCourse);

//Add lectures,Delete Course,Get Course Details  
router
      .route("/course/:id")
      .get( isAuthenticated,authorizeSubscribers,getCourseLectures)
      .post(isAuthenticated, singleUpload,addLecture)
      .delete(isAuthenticated,authorizeAdmin,deleteCourse);


//Delete lecture from course,Get all lectures of a course
router
     .route("/lecture")
     .delete(isAuthenticated,authorizeAdmin,deleteLecture);


export default router;