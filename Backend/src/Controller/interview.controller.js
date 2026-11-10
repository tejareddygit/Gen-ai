const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewModel = require("../Models/interview");

/**
 * description: Generate an interview report based on the provided resume, self-description, and job description
 */

async function generateInterviewReportcontroller(req, res) {
  const resumeFile = req.file;
  const resumeContent = await new pdfParse.PDFParse({
    data: new Uint8Array(resumeFile.buffer),
  }).getText();
  const { selfDescription, jobDescription } = req.body;

  const interviewReportBYAi = await generateInterviewReport({
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
  });

  const interviewReport = await interviewModel.create({
    user: req.user.id,
    resume: resumeContent.text,
    selfDescription,
    jobDescription,
    ...interviewReportBYAi,
  });

  res.status(201).json({
    message: "Interview Report is generated successfully",
    interviewReport,
  });
}

async function getReportByIdController(req, res) {
  const { reportId } = req.params;
  const interviewReport = await interviewModel.findById(reportId);

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview Report not found" });
  }

  res
    .status(200)
    .json({ message: "Interview Report found successfully", interviewReport });
}

async function getAllReportsController(req, res) {
  const userId = req.user.id;
  const interviewReports = await interviewModel
    .find({ user: userId })
    .sort({ createdAt: -1 })
    .select(
      "resume -selfDescription -jobDescription -technicalQuestions -behaviouralQuestions -skillGaps -preparationPlan -title",
    );

  res.status(200).json({
    message: "Interview Reports found successfully",
    interviewReports,
  });
}

module.exports = {
  generateInterviewReportcontroller,
  getReportByIdController,
  getAllReportsController,
};
