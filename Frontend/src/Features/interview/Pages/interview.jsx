import { useState } from "react";
import { useLocation } from "react-router";
import { useInterview } from "../Hooks/useInterview";
import {
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  Check,
  ChevronRight,
  CircleHelp,
  Map,
  Target,
} from "lucide-react";
import "../style/interview.scss";

const sections = [
  { id: "technical", label: "Technical questions", icon: BrainCircuit },
  { id: "behavioural", label: "Behavioural questions", icon: CircleHelp },
  { id: "roadmap", label: "Road Map", icon: Map },
];

const Interview = ({ report: reportProp }) => {
  const location = useLocation();
  const { report: interviewReport } = useInterview();
  const [activeSection, setActiveSection] = useState("technical");
  const routeReport = location.state?.interviewReport ?? location.state?.report;
  const report = reportProp ?? routeReport?.interviewReport ?? routeReport;
  const technicalQuestions = Array.isArray(report?.technicalQuestions)
    ? report.technicalQuestions
    : [];
  const behaviouralQuestions = Array.isArray(report?.behaviouralQuestions)
    ? report.behaviouralQuestions
    : [];
  const skillGaps = Array.isArray(report?.skillGaps) ? report.skillGaps : [];
  const preparationPlan = Array.isArray(report?.preparationPlan)
    ? report.preparationPlan
    : [];

  const activeQuestions =
    activeSection === "technical" ? technicalQuestions : behaviouralQuestions;

  return (
    <main className="interview-page">
      <div className="interview-page__container">
        <header className="interview-page__header">
          <div>
            <p className="interview-page__eyebrow">YOUR PREPARATION SPACE</p>
            <h1>
              Interview <span>roadmap</span>
            </h1>
            <p className="interview-page__subtitle">
              Your personalized questions, skill gaps, and preparation plan.
            </p>
          </div>
          {typeof report?.matchScore === "number" && (
            <div
              className="interview-page__score"
              aria-label={`Match score ${report.matchScore}%`}
            >
              <Target size={17} />
              <span>
                <strong>{report.matchScore}%</strong>
                <small>match score</small>
              </span>
            </div>
          )}
        </header>

        <div className="interview-dashboard">
          <nav
            className="interview-dashboard__navigation"
            aria-label="Report sections"
          >
            <p className="interview-dashboard__label">YOUR REPORT</p>
            <div className="interview-dashboard__nav-list">
              {sections.map(({ id, label, icon: Icon }) => {
                const count =
                  id === "technical"
                    ? technicalQuestions.length
                    : id === "behavioural"
                      ? behaviouralQuestions.length
                      : preparationPlan.length;

                return (
                  <button
                    className={`interview-dashboard__nav-item${activeSection === id ? " is-active" : ""}`}
                    key={id}
                    type="button"
                    onClick={() => setActiveSection(id)}
                    aria-current={activeSection === id ? "page" : undefined}
                  >
                    <Icon size={17} />
                    <span>{label}</span>
                    <small>{count}</small>
                  </button>
                );
              })}
            </div>
            <div className="interview-dashboard__tip">
              <BookOpen size={17} />
              <p>
                Review each answer and make it your own before interview day.
              </p>
            </div>
          </nav>

          <section className="interview-dashboard__content" aria-live="polite">
            {activeSection === "roadmap" ? (
              <>
                <div className="interview-dashboard__section-heading">
                  <div>
                    <p className="interview-dashboard__label">
                      YOUR STUDY PLAN
                    </p>
                    <h2>Preparation roadmap</h2>
                  </div>
                  <span className="interview-dashboard__count">
                    {preparationPlan.length} days
                  </span>
                </div>
                {preparationPlan.length ? (
                  <div className="interview-dashboard__roadmap">
                    {preparationPlan.map((day) => (
                      <article className="roadmap-day" key={day.day}>
                        <div className="roadmap-day__number">{day.day}</div>
                        <div className="roadmap-day__body">
                          <p className="roadmap-day__eyebrow">DAY {day.day}</p>
                          <h3>{day.focus}</h3>
                          {Array.isArray(day.tasks) && day.tasks.length > 0 && (
                            <ul>
                              {day.tasks.map((task) => (
                                <li key={task}>
                                  <Check size={14} />
                                  <span>{task}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            ) : (
              <>
                <div className="interview-dashboard__section-heading">
                  <div>
                    <p className="interview-dashboard__label">
                      {activeSection === "technical"
                        ? "CORE KNOWLEDGE"
                        : "GET TO KNOW YOU"}
                    </p>
                    <h2>
                      {activeSection === "technical"
                        ? "Technical questions"
                        : "Behavioural questions"}
                    </h2>
                  </div>
                  <span className="interview-dashboard__count">
                    {activeQuestions.length} questions
                  </span>
                </div>
                {activeQuestions.length ? (
                  <div className="interview-dashboard__questions">
                    {activeQuestions.map((item, index) => (
                      <article
                        className="question-card"
                        key={`${index}-${item.question}`}
                      >
                        <div className="question-card__number">
                          {String(index + 1).padStart(2, "0")}
                        </div>
                        <div className="question-card__body">
                          <h3>{item.question}</h3>
                          {item.intention && (
                            <div className="question-card__detail">
                              <span>WHAT THEY&apos;RE LOOKING FOR</span>
                              <p>{item.intention}</p>
                            </div>
                          )}
                          {item.answer && (
                            <div className="question-card__answer">
                              <span>
                                <ArrowUpRight size={14} /> SUGGESTED ANSWER
                              </span>
                              <p>{item.answer}</p>
                            </div>
                          )}
                        </div>
                      </article>
                    ))}
                  </div>
                ) : (
                  <EmptyState />
                )}
              </>
            )}
          </section>

          <aside className="interview-dashboard__skills">
            <div className="interview-dashboard__section-heading">
              <div>
                <p className="interview-dashboard__label">AREAS TO IMPROVE</p>
                <h2>Skill gaps</h2>
              </div>
              <span className="interview-dashboard__count">
                {skillGaps.length}
              </span>
            </div>
            {skillGaps.length ? (
              <div className="skill-gap-list">
                {skillGaps.map((gap) => (
                  <article className="skill-gap" key={gap.skill}>
                    <div className="skill-gap__heading">
                      <span>{gap.skill}</span>
                      {gap.severity && (
                        <span
                          className={`skill-gap__severity skill-gap__severity--${gap.severity.toLowerCase()}`}
                        >
                          {gap.severity}
                        </span>
                      )}
                    </div>
                    {gap.recommendation && <p>{gap.recommendation}</p>}
                    <ChevronRight className="skill-gap__arrow" size={15} />
                  </article>
                ))}
              </div>
            ) : (
              <p className="interview-dashboard__empty-note">
                Your skill gap analysis will appear here.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

const EmptyState = () => (
  <div className="interview-dashboard__empty">
    <CircleHelp size={22} />
    <h3>No interview report yet</h3>
    <p>
      Generate a personalized interview plan to see your questions and
      preparation tasks here.
    </p>
  </div>
);

export default Interview;
