const pdfParse = require("pdf-parse");
const generateInterviewReport = require("../services/ai.service");
const interviewModel = require("../Models/interview");

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
module.exports = { generateInterviewReportcontroller };
