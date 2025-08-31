import { ERROR_MESSAGES } from "../config/constants.js";

const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Default error
  let status = err.status || 500;
  let message = err.message || ERROR_MESSAGES.SERVER_ERROR;

  // MySQL errors
  if (err.code === "ER_DUP_ENTRY") {
    status = 409;
    message = "Duplicate entry";
  }

  if (err.code === "ER_NO_REFERENCED_ROW_2") {
    status = 400;
    message = "Invalid reference";
  }

  res.status(status).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.stack }),
  });
};

export default errorHandler;
