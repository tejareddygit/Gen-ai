import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

/**
 * Generate interview report
 * @description Generate an interview report based on the provided resume, self-description, and job description
 */

export const generateInterviewReport = async ({
  jobDescription,
  selfDescription,
  resumeFile,
}) => {
  const formData = new FormData();
  formData.append("jobDescription", jobDescription);
  formData.append("selfDescription", selfDescription);
  formData.append("resume", resumeFile);
  const response = await api.post("/api/interview/", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 *Get interview report by id
 * @description Get the interview report by its ID
 */

export const getInterviewReportById = async (interviewId) => {
  const response = await api.get(`/api/interview/${interviewId}`);
  return response.data;
};

/**
 * Get all interview reports for the authenticated user
 * @description Get all interview reports for the authenticated user
 */
export const getAllInterviewReports = async () => {
  const response = await api.get("/api/interview/");
  return response.data;
};
