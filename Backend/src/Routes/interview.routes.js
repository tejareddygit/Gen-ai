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

module.exports = interviewRouter;
