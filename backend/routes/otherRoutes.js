import express from "express";
import {contact,courserequest,getDashboardStats} from "../controllers/otherController.js"


import { authorizeAdmin, isAuthenticated } from "../middlewares/auth.js";


const router = express.Router();


//contact form
router.route("/contact").post(contact);

//Request form
router.route("/courserequest").post(courserequest);

// Get Admin Dashboard Stats
router
  .route("/admin/stats")
  .get(isAuthenticated, authorizeAdmin,getDashboardStats);

export default router;