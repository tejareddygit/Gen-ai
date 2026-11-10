import React from "react";
import "../style/home.scss";

const Home = () => {
  return (
    <main className="home">
      <div className="interview-report-group">
        <div className="left">
          <label htmlFor="jobDescription">Job Description</label>
          <textarea
            name="jobDescription"
            id="jobDescription"
            placeholder="Enter job description"
          ></textarea>
        </div>
        <div className="right">
          <div className="input-group">
            <p>
              Resume<> </>
              <small className="highlight">
                (use Resume and Self Description together for best results)
              </small>
            </p>
            <label className="file-label" htmlFor="resume">
              Upload Resume
            </label>
            <input hidden type="file" name="resume" id="resume" accept=".pdf" />
          </div>
          <div className="input-group">
            <label htmlFor="selfDescription">Self Description</label>
            <textarea name="selfDescription" id="selfDescription" />
          </div>
          <button className="button primary-button">
            Generate Interview Report
          </button>
        </div>
      </div>
    </main>
  );
};

export default Home;
