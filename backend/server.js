import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import app from "./src/app.js";
import { testConnection } from "./src/config/database.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

// Test database connection
testConnection();

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
});
