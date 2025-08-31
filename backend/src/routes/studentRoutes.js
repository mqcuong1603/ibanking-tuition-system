import express from "express";
import {
  getStudentInfo,
  checkStudentPayment,
} from "../controllers/studentController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get student information
router.get("/:student_id", authenticate, getStudentInfo);

// Check payment status
router.get("/:student_id/payment-status", authenticate, checkStudentPayment);

export default router;
