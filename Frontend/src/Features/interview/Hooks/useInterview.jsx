import {
  generateInterviewReport,
  getInterviewReportById,
  getAllInterviewReports,
} from "../Services/interview.api";
import { useContext } from "react";
import { InterviewContext } from "../interview.context";

export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error("useInterview must be used within an InterviewProvider");
  }
  const { loading, setLoading, report, setReport, reports, setReports } =
    context;

  const generateReport = async ({
    jobDescription,
    selfDescription,
    resumeFile,
  }) => {
    setLoading(true);
    try {
      const data = await generateInterviewReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });
      setReport(data.interviewReport);
      return data;
    } catch (error) {
      console.error("Error generating interview report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getReportById = async (reportId) => {
    setLoading(true);
    try {
      const data = await getInterviewReportById(reportId);
      setReport(data.interviewReport);
      return data;
    } catch (error) {
      console.error("Error fetching interview report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAllReports = async () => {
    setLoading(true);
    try {
      const data = await getAllInterviewReports();
      setReports(data.interviewReports);
      return data;
    } catch (error) {
      console.error("Error fetching all interview reports:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    report,
    reports,
    generateReport,
    getReportById,
    getAllReports,
  };
};
