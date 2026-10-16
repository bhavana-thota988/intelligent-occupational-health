import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Brain,
  CalendarDays,
  CheckCircle2,
  HeartPulse,
  Info,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Link } from "react-router-dom";

const normalScores = {
  Never: 0,
  Rarely: 1,
  Sometimes: 2,
  Often: 3,
  "Very often": 4,
};

const reverseScores = {
  "Very well": 0,
  Well: 1,
  Moderately: 2,
  Poorly: 3,
  "Very poorly": 4,

  "Very comfortable": 0,
  Comfortable: 1,
  "Moderately comfortable": 2,
  Uncomfortable: 3,
  "Very uncomfortable": 4,
};

function getScore(answer, reverse = false) {
  if (!answer) return 0;

  if (reverse) {
    return reverseScores[answer] ?? 0;
  }

  return normalScores[answer] ?? 0;
}

function getPercentage(score, maximum) {
  return Math.round((score / maximum) * 100);
}

function getRiskLevel(score, maximum) {
  const percentage = getPercentage(score, maximum);

  if (percentage <= 35) return "Low";
  if (percentage <= 65) return "Moderate";
  return "High";
}

function getRiskClass(level) {
  return level.toLowerCase();
}

function getRiskDescription(level, type) {
  if (level === "Low") {
    return `${type} indicators are currently in a lower-risk range. Continue maintaining healthy workplace habits.`;
  }

  if (level === "Moderate") {
    return `${type} indicators show some areas that may benefit from attention and healthier work practices.`;
  }

  return `${type} indicators are elevated. Review the contributing factors and recommended workplace actions.`;
}

function getProgressWidth(score, maximum) {
  return `${Math.max(8, getPercentage(score, maximum))}%`;
}

function RiskResult() {
  const savedAnswers = localStorage.getItem("assessmentAnswers");
  const completedAt = localStorage.getItem(
    "assessmentCompletedAt"
  );

  const answers = savedAnswers
    ? JSON.parse(savedAnswers)
    : null;

  if (!answers) {
    return (
      <div className="risk-result-page">
        <header className="risk-result-header">
          <Link
            to="/employee/dashboard"
            className="risk-result-back"
          >
            <ArrowLeft size={17} />
            Dashboard
          </Link>

          <div className="risk-result-header-title">
            <div className="risk-result-title-icon">
              <ShieldCheck size={19} />
            </div>

            <div>
              <span>EMPLOYEE HEALTH</span>
              <h1>Risk Insights</h1>
            </div>
          </div>

          <div className="risk-result-private">
            <ShieldCheck size={14} />
            Private results
          </div>
        </header>

        <main className="risk-result-main">
          <section className="risk-empty-state">
            <div className="risk-empty-icon">
              <Activity size={28} />
            </div>

            <span>ASSESSMENT REQUIRED</span>

            <h2>
              Complete your workplace health assessment
            </h2>

            <p>
              Your workplace risk insights will be generated
              after you complete the assessment.
            </p>

            <Link
              to="/employee/assessment"
              className="risk-primary-button"
            >
              Start Assessment
              <ArrowRight size={16} />
            </Link>
          </section>
        </main>
      </div>
    );
  }

  /*
    Stress:
    Q1 = workload difficulty
    Q2 = extended working hours
    Q3 = mental fatigue
    Q8 = work-related stress
  */
  const stressScore =
    getScore(answers[1]) +
    getScore(answers[2]) +
    getScore(answers[3]) +
    getScore(answers[8]);

  /*
    Burnout:
    Q2 = extended working hours
    Q3 = mental fatigue
    Q4 = work-life balance
  */
  const burnoutScore =
    getScore(answers[2]) +
    getScore(answers[3]) +
    getScore(answers[4], true);

  /*
    Ergonomic:
    Q5 = workstation comfort
    Q6 = physical discomfort
    Q7 = break frequency
  */
  const ergonomicScore =
    getScore(answers[5], true) +
    getScore(answers[6]) +
    getScore(answers[7], true);

  const stressMaximum = 16;
  const burnoutMaximum = 12;
  const ergonomicMaximum = 12;

  const stressPercentage = getPercentage(
    stressScore,
    stressMaximum
  );

  const burnoutPercentage = getPercentage(
    burnoutScore,
    burnoutMaximum
  );

  const ergonomicPercentage = getPercentage(
    ergonomicScore,
    ergonomicMaximum
  );

  const stressRisk = getRiskLevel(
    stressScore,
    stressMaximum
  );

  const burnoutRisk = getRiskLevel(
    burnoutScore,
    burnoutMaximum
  );

  const ergonomicRisk = getRiskLevel(
    ergonomicScore,
    ergonomicMaximum
  );

  const levels = [
    stressRisk,
    burnoutRisk,
    ergonomicRisk,
  ];

  const highCount = levels.filter(
    (level) => level === "High"
  ).length;

  const moderateCount = levels.filter(
    (level) => level === "Moderate"
  ).length;

  let overallRisk = "Low";

  if (highCount > 0) {
    overallRisk = "High";
  } else if (moderateCount > 0) {
    overallRisk = "Moderate";
  }

  const assessmentDate = completedAt
    ? new Date(completedAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Recent assessment";

  const riskItems = [
    {
      title: "Stress Risk",
      type: "Stress",
      icon: Brain,
      level: stressRisk,
      score: stressScore,
      maximum: stressMaximum,
      percentage: stressPercentage,
      description: getRiskDescription(
        stressRisk,
        "Stress"
      ),
      factors: [
        "Workload pressure",
        "Extended working hours",
        "Mental fatigue",
        "Work-related stress",
      ],
    },

    {
      title: "Burnout Risk",
      type: "Burnout",
      icon: HeartPulse,
      level: burnoutRisk,
      score: burnoutScore,
      maximum: burnoutMaximum,
      percentage: burnoutPercentage,
      description: getRiskDescription(
        burnoutRisk,
        "Burnout"
      ),
      factors: [
        "Working beyond normal hours",
        "Mental fatigue",
        "Work-life balance",
      ],
    },

    {
      title: "Ergonomic Risk",
      type: "Ergonomic",
      icon: Activity,
      level: ergonomicRisk,
      score: ergonomicScore,
      maximum: ergonomicMaximum,
      percentage: ergonomicPercentage,
      description: getRiskDescription(
        ergonomicRisk,
        "Ergonomic"
      ),
      factors: [
        "Workstation comfort",
        "Physical discomfort",
        "Break frequency",
      ],
    },
  ];

  return (
    <div className="risk-result-page">

      {/* HEADER */}

      <header className="risk-result-header">

        <Link
          to="/employee/dashboard"
          className="risk-result-back"
        >
          <ArrowLeft size={17} />
          Dashboard
        </Link>

        <div className="risk-result-header-title">

          <div className="risk-result-title-icon">
            <ShieldCheck size={19} />
          </div>

          <div>
            <span>EMPLOYEE HEALTH</span>
            <h1>Risk Insights</h1>
          </div>

        </div>

        <div className="risk-result-private">
          <ShieldCheck size={14} />
          Private results
        </div>

      </header>

      <main className="risk-result-main">

        {/* INTRO */}

        <section className="risk-result-intro">

          <div>
            <span>WORKPLACE HEALTH PROFILE</span>

            <h2>
              Your current workplace risk profile
            </h2>

            <p>
              A summary of the indicators generated from
              your latest workplace health assessment.
            </p>
          </div>

          <div className="risk-assessment-date">
            <CalendarDays size={16} />

            <div>
              <span>ASSESSED ON</span>
              <strong>{assessmentDate}</strong>
            </div>
          </div>

        </section>

        {/* OVERALL STATUS */}

        <section className="risk-overview-card">

          <div className="risk-overview-main">

            <div className="risk-overview-icon">
              <TrendingUp size={22} />
            </div>

            <div>

              <span>OVERALL SCREENING STATUS</span>

              <h2>
                {overallRisk} risk indicators
              </h2>

              <p>
                Based on your Stress, Burnout and Ergonomic
                workplace health indicators.
              </p>

            </div>

          </div>

          <div
            className={`risk-overview-badge ${getRiskClass(
              overallRisk
            )}`}
          >
            {overallRisk}
          </div>

        </section>

        {/* RISK SECTION */}

        <section className="risk-details-section">

          <div className="risk-section-heading">

            <div>
              <span>RISK INDICATORS</span>

              <h2>
                Current workplace health indicators
              </h2>
            </div>

            <p>
              Higher scores indicate more areas requiring
              workplace attention.
            </p>

          </div>

          <div className="risk-details-grid">

            {riskItems.map((item) => {

              const Icon = item.icon;

              return (
                <article
                  className="risk-detail-card"
                  key={item.title}
                >

                  <div className="risk-detail-header">

                    <div className="risk-detail-title">

                      <div className="risk-detail-icon">
                        <Icon size={20} />
                      </div>

                      <div>
                        <span>{item.type}</span>
                        <h3>{item.title}</h3>
                      </div>

                    </div>

                    <div
                      className={`risk-detail-badge ${getRiskClass(
                        item.level
                      )}`}
                    >
                      {item.level}
                    </div>

                  </div>

                  <div className="risk-score-row">

                    <div>
                      <strong>
                        {item.score}
                      </strong>

                      <span>
                        / {item.maximum} indicator score
                      </span>
                    </div>

                    <span>
                      {item.percentage}%
                    </span>

                  </div>

                  <div className="risk-score-track">
                    <div
                      className={`risk-score-fill ${getRiskClass(
                        item.level
                      )}`}
                      style={{
                        width: getProgressWidth(
                          item.score,
                          item.maximum
                        ),
                      }}
                    />
                  </div>

                  <p className="risk-detail-description">
                    {item.description}
                  </p>

                  <div className="risk-factor-block">

                    <span>
                      KEY ASSESSMENT AREAS
                    </span>

                    <div className="risk-factor-list">

                      {item.factors.map((factor) => (
                        <div
                          className="risk-factor"
                          key={factor}
                        >
                          <CheckCircle2 size={14} />
                          {factor}
                        </div>
                      ))}

                    </div>

                  </div>

                </article>
              );
            })}

          </div>

        </section>

        {/* INTERPRETATION */}

        <section className="risk-interpretation">

          <div className="risk-section-heading">

            <span>RESULT INTERPRETATION</span>

            <h2>
              What your indicators represent
            </h2>

          </div>

          <div className="risk-interpretation-grid">

            <div className="risk-interpretation-item">

              <Brain size={20} />

              <div>
                <strong>Stress Risk</strong>

                <p>
                  Based on workload pressure, extended
                  working hours, mental fatigue and
                  work-related stress responses.
                </p>
              </div>

            </div>

            <div className="risk-interpretation-item">

              <HeartPulse size={20} />

              <div>
                <strong>Burnout Risk</strong>

                <p>
                  Based on work intensity, mental fatigue
                  and work-life balance indicators.
                </p>
              </div>

            </div>

            <div className="risk-interpretation-item">

              <Activity size={20} />

              <div>
                <strong>Ergonomic Risk</strong>

                <p>
                  Based on workstation comfort, physical
                  discomfort and break-related responses.
                </p>
              </div>

            </div>

          </div>

        </section>

        {/* ACTION */}

        <section className="risk-action-card">

          <div className="risk-action-icon">
            <ArrowRight size={21} />
          </div>

          <div className="risk-action-content">

            <span>RECOMMENDED NEXT STEP</span>

            <h3>
              Turn your insights into workplace actions
            </h3>

            <p>
              Review practical guidance based on your
              current workplace health indicators.
            </p>

          </div>

          <Link
            to="/employee/recommendations"
            className="risk-action-button"
          >
            View Recommendations
            <ArrowRight size={15} />
          </Link>

        </section>

        {/* NOTICE */}

        <div className="risk-result-notice">

          <Info size={16} />

          <p>
            These results are workplace health screening
            indicators intended for awareness and workplace
            decision support. They are not a medical diagnosis.
          </p>

        </div>

      </main>

    </div>
  );
}

export default RiskResult;