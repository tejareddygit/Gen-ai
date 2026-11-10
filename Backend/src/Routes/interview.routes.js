const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const interviewController = require("../Controller/interview.controller");
const upload = require("../middleware/file.middleware");

const interviewRouter = express.Router();

/**
 * @route POST /api/interview/
 * @desc Generate an interview report based on the provided resume, self-description, and job description
 * @access Private
 */
interviewRouter.post(
  "/",
  authMiddleware.authUser,
  upload.single("resume"),
  interviewController.generateInterviewReportcontroller,
);

/**
 * @route GET /api/interview/report/:reportId
 * @desc Get the interview report by its ID
 * @access Private
 */
interviewRouter.get(
  "/reposrt/:reportId",
  authMiddleware.authUser,
  interviewController.getReportByIdController,
);

/**
 * @route GET /api/interview/
 * @desc Get all interview reports for the authenticated user
 * @access Private
 */

interviewRouter.get(
  "/",
  authMiddleware.authUser,
  interviewController.getAllReportsController,
);

module.exports = interviewRouter;
