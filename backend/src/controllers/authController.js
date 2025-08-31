import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { config } from "../config/env.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from "../config/constants.js";

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Find user
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Verify password
    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }

    // Generate token
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
      },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    // Remove password from response
    delete user.password;

    res.json({
      success: true,
      message: SUCCESS_MESSAGES.LOGIN_SUCCESS,
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res) => {
  res.json({
    success: true,
    message: SUCCESS_MESSAGES.LOGOUT_SUCCESS,
  });
};
