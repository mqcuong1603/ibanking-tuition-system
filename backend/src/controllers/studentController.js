import Student from "../models/Student.js";
import { ERROR_MESSAGES } from "../config/constants.js";

export const getStudentInfo = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    const student = await Student.findById(student_id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.STUDENT_NOT_FOUND,
      });
    }

    res.json({
      success: true,
      data: student,
    });
  } catch (error) {
    next(error);
  }
};

export const checkStudentPayment = async (req, res, next) => {
  try {
    const { student_id } = req.params;

    const student = await Student.findById(student_id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: ERROR_MESSAGES.STUDENT_NOT_FOUND,
      });
    }

    res.json({
      success: true,
      data: {
        student_id: student.student_id,
        full_name: student.full_name,
        tuition_amount: student.tuition_amount,
        is_paid: student.is_paid,
        payment_status: student.is_paid ? "Đã thanh toán" : "Chưa thanh toán",
      },
    });
  } catch (error) {
    next(error);
  }
};
