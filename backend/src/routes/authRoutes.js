import express from "express";
import { body } from "express-validator";
import { login, getProfile, logout } from "../controllers/authController.js";
import { authenticate } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

// Login
router.post(
  "/login",
  [
    body("username").notEmpty().withMessage("Username is required"),
    body("password").notEmpty().withMessage("Password is required"),
    validateRequest,
  ],
  login
);

// Get profile
router.get("/profile", authenticate, getProfile);

// Logout
router.post("/logout", authenticate, logout);

export default router;
