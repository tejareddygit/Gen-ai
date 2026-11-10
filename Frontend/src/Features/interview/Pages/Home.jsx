import React, { useState } from "react";
import {
  UploadCloud,
  BriefcaseBusiness,
  UserRound,
  Sparkles,
  Info,
} from "lucide-react";
import "../style/home.scss";
import { useInterview } from "../Hooks/useInterview";
import { useNavigate } from "react-router";

const Home = () => {
  const { loading, generateReport } = useInterview();
  const navigate = useNavigate();

  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = React.useRef(null);
  const [resume, setResume] = useState(null);

  const handleGenerateReport = async () => {
    try {
      const resumeFile = resumeInputRef.current?.files?.[0];

      const data = await generateReport({
        jobDescription,
        selfDescription,
        resumeFile,
      });

      const interviewReport = data?.interviewReport;

      if (!interviewReport?._id) {
        throw new Error("Interview report ID is missing");
      }

      navigate(`/interview/${interviewReport._id}`, {
        state: { interviewReport },
      });
    } catch (error) {
      console.error("Failed to generate interview report:", error);

      alert(
        error.response?.data?.message ||
          error.message ||
          "Failed to generate interview report",
      );
    }
  };

  return (
    <main className="home">
      <div className="home-container">
        <header className="home-header">
          <h1>
            Create Your Custom <span>Interview Plan</span>
          </h1>
          <p>
            Let our AI analyze the job requirements and your unique profile to
            <br />
            build a winning strategy.
          </p>
        </header>

        <div className="interview-report-group">
          {/* Left Section */}
          <section className="left">
            <div className="section-title">
              <div>
                <BriefcaseBusiness size={15} />
                <label htmlFor="jobDescription">Target Job Description</label>
              </div>
              <span className="required-badge">REQUIRED</span>
            </div>

            <textarea
              name="jobDescription"
              id="jobDescription"
              maxLength={5000}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the full job description here...

e.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'"
            />

            <div className="character-count">
              {jobDescription.length} / 5000 chars
            </div>
          </section>

          {/* Right Section */}
          <section className="right">
            <div className="section-title">
              <div>
                <UserRound size={15} />
                <label>Your Profile</label>
              </div>
            </div>

            <div className="input-group">
              <p className="field-label">
                Upload Resume
                <span className="recommended-badge">BEST RESULTS</span>
              </p>

              <label className="file-label" htmlFor="resume">
                <UploadCloud size={24} />
                <strong>
                  {resume ? resume.name : "Click to upload or drag & drop"}
                </strong>
                <small>PDF or DOCX (Max 5MB)</small>
              </label>

              <input
                ref={resumeInputRef}
                hidden
                type="file"
                name="resume"
                id="resume"
                accept=".pdf"
                onChange={(e) => setResume(e.target.files[0] || null)}
              />
            </div>

            <div className="or-divider">
              <span>OR</span>
            </div>

            <div className="input-group self-description-group">
              <label htmlFor="selfDescription">Quick Self-Description</label>

              <textarea
                name="selfDescription"
                id="selfDescription"
                value={selfDescription}
                onChange={(e) => setSelfDescription(e.target.value)}
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
              />
            </div>

            <div className="info-box">
              <Info size={14} />
              <p>
                Either a <strong>Resume</strong> or a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </section>

          {/* Bottom Action */}
          <footer className="form-footer">
            <p>AI-Powered Strategy Generation · Approx 30s</p>
            <button
              className="button primary-button"
              onClick={handleGenerateReport}
            >
              <Sparkles size={15} />
              Generate My Interview Strategy
            </button>
          </footer>
        </div>
      </div>
    </main>
  );
};

export default Home;
