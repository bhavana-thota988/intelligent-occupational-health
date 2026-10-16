import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  RotateCcw,
  ShieldCheck,
  Activity,
  Monitor,
  Clock3,
  AlertCircle,
} from "lucide-react";

import {
  FilesetResolver,
  PoseLandmarker,
} from "@mediapipe/tasks-vision";

function ErgonomicCheck() {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const timerRef = useRef(null);
  const poseLandmarkerRef = useRef(null);
  const animationRef = useRef(null);

  const [cameraStarted, setCameraStarted] = useState(false);
  const [checking, setChecking] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [cameraError, setCameraError] = useState("");

  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStatus, setAnalysisStatus] = useState(
    "Preparing posture analysis..."
  );

  const [result, setResult] = useState(null);

  /* --------------------------------------------------
     STOP CAMERA
  -------------------------------------------------- */

  const stopCamera = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  /* --------------------------------------------------
     CLEANUP
  -------------------------------------------------- */

  useEffect(() => {
    return () => {
      stopCamera();

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      if (poseLandmarkerRef.current) {
        poseLandmarkerRef.current.close();
        poseLandmarkerRef.current = null;
      }
    };
  }, []);

  /* --------------------------------------------------
     LOAD MEDIAPIPE
  -------------------------------------------------- */

  const loadPoseLandmarker = async () => {
    if (poseLandmarkerRef.current) {
      return poseLandmarkerRef.current;
    }

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm"
    );

    const poseLandmarker =
      await PoseLandmarker.createFromOptions(
        vision,
        {
          baseOptions: {
            modelAssetPath:
              "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task",
          },

          runningMode: "VIDEO",

          numPoses: 1,

          minPoseDetectionConfidence: 0.5,

          minPosePresenceConfidence: 0.5,

          minTrackingConfidence: 0.5,
        }
      );

    poseLandmarkerRef.current = poseLandmarker;

    return poseLandmarker;
  };

  /* --------------------------------------------------
     CAMERA STREAM
  -------------------------------------------------- */

  useEffect(() => {
    if (
      cameraStarted &&
      videoRef.current &&
      streamRef.current
    ) {
      videoRef.current.srcObject =
        streamRef.current;

      videoRef.current
        .play()
        .catch((error) => {
          console.error(
            "Video playback error:",
            error
          );
        });
    }
  }, [cameraStarted]);

  /* --------------------------------------------------
     START MONITORING
  -------------------------------------------------- */

  const startMonitoring = async () => {
    setCameraError("");

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          "Camera access is not supported by this browser."
        );
        return;
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",
            width: {
              ideal: 1280,
            },
            height: {
              ideal: 720,
            },
          },
          audio: false,
        });

      streamRef.current = stream;

      setCameraStarted(true);
      setChecking(false);
    } catch (error) {
      console.error(
        "Camera error:",
        error
      );

      if (error.name === "NotAllowedError") {
        setCameraError(
          "Camera permission was denied. Please allow camera access and try again."
        );
      } else if (
        error.name === "NotFoundError"
      ) {
        setCameraError(
          "No camera was found on this device."
        );
      } else {
        setCameraError(
          "Unable to access the camera. Please try again."
        );
      }
    }
  };

  /* --------------------------------------------------
     ANGLE CALCULATION
  -------------------------------------------------- */

  const calculateAngle = (
    pointA,
    pointB,
    pointC
  ) => {
    const radians =
      Math.atan2(
        pointC.y - pointB.y,
        pointC.x - pointB.x
      ) -
      Math.atan2(
        pointA.y - pointB.y,
        pointA.x - pointB.x
      );

    let angle =
      Math.abs(
        (radians * 180) / Math.PI
      );

    if (angle > 180) {
      angle = 360 - angle;
    }

    return angle;
  };

  /* --------------------------------------------------
     ANALYZE POSTURE
  -------------------------------------------------- */

  const analyzePosture = (
    landmarks
  ) => {
    if (!landmarks || landmarks.length < 33) {
      return null;
    }

    const nose = landmarks[0];

    const leftShoulder =
      landmarks[11];

    const rightShoulder =
      landmarks[12];

    const leftHip =
      landmarks[23];

    const rightHip =
      landmarks[24];

    const leftEar =
      landmarks[7];

    const rightEar =
      landmarks[8];

    /* Average body points */

    const shoulder = {
      x:
        (leftShoulder.x +
          rightShoulder.x) /
        2,

      y:
        (leftShoulder.y +
          rightShoulder.y) /
        2,
    };

    const hip = {
      x:
        (leftHip.x +
          rightHip.x) /
        2,

      y:
        (leftHip.y +
          rightHip.y) /
        2,
    };

    const ear = {
      x:
        (leftEar.x +
          rightEar.x) /
        2,

      y:
        (leftEar.y +
          rightEar.y) /
        2,
    };

    /* Shoulder alignment */

    const shoulderTilt =
      Math.abs(
        leftShoulder.y -
          rightShoulder.y
      );

    /* Head forward indicator */

    const headForward =
      Math.abs(
        ear.x -
          shoulder.x
      );

    /* Torso alignment */

    const torsoAngle =
      Math.abs(
        Math.atan2(
          shoulder.x -
            hip.x,
          hip.y -
            shoulder.y
        ) *
          (180 / Math.PI)
      );

    /* Neck / head angle */

    const neckAngle =
      calculateAngle(
        nose,
        ear,
        shoulder
      );

    /* Risk points */

    let postureScore = 0;

    let postureStatus =
      "Good alignment";

    let workstationStatus =
      "Looks appropriate";

    let breakStatus =
      "Maintain regular breaks";

    const recommendations = [];

    /* Shoulder */

    if (shoulderTilt > 0.06) {
      postureScore += 25;

      postureStatus =
        "Shoulder alignment needs attention";

      recommendations.push(
        "Keep both shoulders relaxed and at a similar height while working."
      );
    }

    /* Head position */

    if (headForward > 0.13) {
      postureScore += 30;

      postureStatus =
        "Head position needs attention";

      recommendations.push(
        "Keep your head closer to a neutral position and avoid leaning toward the screen."
      );
    }

    /* Torso */

    if (torsoAngle > 10) {
      postureScore += 25;

      recommendations.push(
        "Keep your back supported and maintain a more upright sitting position."
      );
    }

    /* Neck */

    if (
      neckAngle < 55 ||
      neckAngle > 125
    ) {
      postureScore += 20;

      recommendations.push(
        "Adjust your screen and seating position to reduce prolonged neck bending."
      );
    }

    /* Default recommendations */

    if (
      recommendations.length === 0
    ) {
      recommendations.push(
        "Your detected posture is relatively well aligned. Continue maintaining a comfortable neutral position."
      );

      recommendations.push(
        "Keep the monitor near eye level and maintain a comfortable viewing distance."
      );

      recommendations.push(
        "Continue taking short movement breaks during prolonged computer work."
      );
    } else {
      recommendations.push(
        "Take short movement breaks during prolonged computer work."
      );
    }

    /* Remove duplicates */

    const uniqueRecommendations =
      [
        ...new Set(
          recommendations
        ),
      ].slice(0, 3);

    /* Risk */

    let riskLevel = "Low";

    if (postureScore >= 50) {
      riskLevel = "High";
    } else if (postureScore >= 25) {
      riskLevel = "Moderate";
    }

    if (riskLevel === "High") {
      breakStatus =
        "More frequent movement breaks recommended";
      workstationStatus =
        "Review workstation setup";
    } else if (
      riskLevel === "Moderate"
    ) {
      breakStatus =
        "Regular movement breaks recommended";
      workstationStatus =
        "Some adjustments may help";
    }

    return {
      score: postureScore,
      riskLevel,
      postureStatus,
      workstationStatus,
      breakStatus,
      recommendations:
        uniqueRecommendations,
    };
  };

  /* --------------------------------------------------
     RUN POSTURE ANALYSIS
  -------------------------------------------------- */

  const runPostureAnalysis =
    async () => {
      try {
        setAnalysisStatus(
          "Loading posture model..."
        );

        const poseLandmarker =
          await loadPoseLandmarker();

        setAnalysisStatus(
          "Detecting body position..."
        );

        const video =
          videoRef.current;

        if (!video) {
          throw new Error(
            "Video element not available."
          );
        }

        const samples = [];

        const startTime =
          performance.now();

        const duration = 5000;

        const analyzeFrame =
          () => {
            if (
              !video ||
              video.readyState <
                2
            ) {
              animationRef.current =
                requestAnimationFrame(
                  analyzeFrame
                );

              return;
            }

            const now =
              performance.now();

            const elapsed =
              now - startTime;

            const progress = Math.min(
              100,
              Math.round(
                (elapsed /
                  duration) *
                  100
              )
            );

            setAnalysisProgress(
              progress
            );

            if (
              progress < 30
            ) {
              setAnalysisStatus(
                "Detecting posture landmarks..."
              );
            } else if (
              progress < 65
            ) {
              setAnalysisStatus(
                "Checking head and shoulder alignment..."
              );
            } else if (
              progress < 90
            ) {
              setAnalysisStatus(
                "Evaluating overall posture..."
              );
            } else {
              setAnalysisStatus(
                "Preparing ergonomic result..."
              );
            }

            try {
              const result =
                poseLandmarker.detectForVideo(
                  video,
                  Math.round(now)
                );

              if (
                result?.landmarks?.length
              ) {
                const posture =
                  analyzePosture(
                    result.landmarks[0]
                  );

                if (posture) {
                  samples.push(
                    posture
                  );
                }
              }
            } catch (error) {
              console.error(
                "Pose detection error:",
                error
              );
            }

            if (
              elapsed <
              duration
            ) {
              animationRef.current =
                requestAnimationFrame(
                  analyzeFrame
                );
            } else {
              finishAnalysis(
                samples
              );
            }
          };

        animationRef.current =
          requestAnimationFrame(
            analyzeFrame
          );
      } catch (error) {
        console.error(
          "Posture analysis error:",
          error
        );

        setCameraError(
          "Posture analysis could not be started. Please try again."
        );

        setChecking(false);
      }
    };

  /* --------------------------------------------------
     FINAL RESULT
  -------------------------------------------------- */

  const finishAnalysis =
    (samples) => {
      stopCamera();

      setChecking(false);
      setCameraStarted(false);

      if (!samples.length) {
        setCameraError(
          "A clear full-body posture could not be detected. Please sit where your upper body is clearly visible and try again."
        );

        return;
      }

      /*
        Use the average score across
        detected frames instead of a
        single frame.
      */

      const averageScore =
        samples.reduce(
          (sum, item) =>
            sum + item.score,
          0
        ) / samples.length;

      let riskLevel = "Low";

      if (averageScore >= 50) {
        riskLevel = "High";
      } else if (
        averageScore >= 25
      ) {
        riskLevel = "Moderate";
      }

      const postureItem =
        samples.reduce(
          (current, item) =>
            item.score >
            current.score
              ? item
              : current
        );

      const finalResult = {
        ...postureItem,
        score: Math.round(
          averageScore
        ),
        riskLevel,
      };

      setResult(
        finalResult
      );

      setCompleted(true);
    };

  /* --------------------------------------------------
     START POSTURE CHECK
  -------------------------------------------------- */

  const beginPostureCheck =
    async () => {
      setCameraError("");
      setChecking(true);
      setAnalysisProgress(0);
      setAnalysisStatus(
        "Preparing posture analysis..."
      );

      await runPostureAnalysis();
    };

  /* --------------------------------------------------
     RESET
  -------------------------------------------------- */

  const resetCheck = () => {
    stopCamera();

    if (timerRef.current) {
      clearTimeout(
        timerRef.current
      );
    }

    setCameraStarted(false);
    setChecking(false);
    setCompleted(false);
    setCameraError("");
    setAnalysisProgress(0);
    setAnalysisStatus(
      "Preparing posture analysis..."
    );
    setResult(null);
  };

  return (
    <div className="ergonomic-page">

      {/* HEADER */}

      <header className="ergonomic-header">

        <Link
          to="/employee/dashboard"
          className="ergonomic-back"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="ergonomic-header-title">

          <div className="ergonomic-title-icon">
            <Activity size={20} />
          </div>

          <div>
            <span>
              EMPLOYEE HEALTH
            </span>

            <h1>
              Ergonomic Check
            </h1>
          </div>

        </div>

        <div className="ergonomic-header-status">
          <ShieldCheck size={16} />
          Private check
        </div>

      </header>

      <main className="ergonomic-main">

        {/* INTRO */}

        {!completed && (
          <section className="ergonomic-intro">

            <span>
              ERGONOMIC MONITORING
            </span>

            <h2>
              Check your workplace posture
            </h2>

            <p>
              Perform a quick posture check to
              understand basic ergonomic risk
              indicators while working.
            </p>

          </section>
        )}

        {/* CAMERA */}

        {!completed ? (

          <section className="ergonomic-monitor-card">

            <div className="camera-area">

              {!cameraStarted ? (

                <div className="camera-placeholder">

                  <div className="camera-icon">
                    <Camera size={30} />
                  </div>

                  <h3>
                    Ready for your posture check?
                  </h3>

                  <p>
                    Your camera will be used for a
                    short ergonomic posture assessment.
                  </p>

                  {cameraError && (
                    <div className="camera-error">

                      <AlertCircle size={16} />

                      <span>
                        {cameraError}
                      </span>

                    </div>
                  )}

                  <button
                    type="button"
                    className="ergonomic-start-button"
                    onClick={
                      startMonitoring
                    }
                  >
                    <Camera size={18} />
                    Start Monitoring
                  </button>

                </div>

              ) : (

                <div className="live-camera-container">

                  <video
                    ref={videoRef}
                    className="live-camera"
                    autoPlay
                    playsInline
                    muted
                  />

                  <div className="camera-overlay">

                    <div className="camera-live-status">

                      <span></span>

                      Camera active

                    </div>

                    {checking && (
                      <div className="camera-analysis-status">

                        <Activity size={17} />

                        {analysisStatus}

                      </div>
                    )}

                  </div>

                  {checking && (
                    <div className="analysis-progress-container">

                      <div className="analysis-progress-text">

                        <span>
                          Posture analysis
                        </span>

                        <strong>
                          {analysisProgress}%
                        </strong>

                      </div>

                      <div className="analysis-progress-bar">

                        <div
                          className="analysis-progress-fill"
                          style={{
                            width:
                              `${analysisProgress}%`,
                          }}
                        />

                      </div>

                    </div>
                  )}

                  {!checking && (
                    <button
                      type="button"
                      className="start-analysis-button"
                      onClick={
                        beginPostureCheck
                      }
                    >
                      <Activity size={18} />
                      Start Posture Check
                    </button>
                  )}

                </div>

              )}

            </div>

            {!cameraStarted && (

              <div className="ergonomic-info-grid">

                <div className="ergonomic-info-item">

                  <div className="ergonomic-info-icon">
                    <Monitor size={18} />
                  </div>

                  <div>

                    <strong>
                      Screen position
                    </strong>

                    <span>
                      Basic screen and head position
                      indicators.
                    </span>

                  </div>

                </div>

                <div className="ergonomic-info-item">

                  <div className="ergonomic-info-icon">
                    <Activity size={18} />
                  </div>

                  <div>

                    <strong>
                      Posture alignment
                    </strong>

                    <span>
                      Basic sitting and upper-body
                      alignment indicators.
                    </span>

                  </div>

                </div>

                <div className="ergonomic-info-item">

                  <div className="ergonomic-info-icon">
                    <Clock3 size={18} />
                  </div>

                  <div>

                    <strong>
                      Quick check
                    </strong>

                    <span>
                      Designed as a short workplace
                      screening.
                    </span>

                  </div>

                </div>

              </div>

            )}

            <div className="ergonomic-notice">

              <ShieldCheck size={16} />

              <span>
                This check is intended for workplace
                health screening and does not provide
                a medical diagnosis.
              </span>

            </div>

          </section>

        ) : (

          /* RESULT */

          <section className="ergonomic-result">

            <div className="result-success-icon">
              <CheckCircle2 size={30} />
            </div>

            <span className="result-label">
              ASSESSMENT COMPLETE
            </span>

            <h2>
              Ergonomic Risk
            </h2>

            <div
              className={`ergonomic-risk-badge ${result?.riskLevel?.toLowerCase()}`}
            >
              {result?.riskLevel}
            </div>

            <p className="ergonomic-result-text">

              {result?.riskLevel === "Low"
                ? "Your detected posture was generally well aligned during this check."
                : result?.riskLevel === "Moderate"
                ? "Your posture check identified some areas that may benefit from improved workplace habits."
                : "Your posture check identified several areas that may require attention to improve workplace ergonomics."}

            </p>

            <div className="ergonomic-score-display">

              <span>
                Posture score
              </span>

              <strong>
                {result?.score ?? 0}/100
              </strong>

            </div>

            <div className="ergonomic-result-grid">

              <div className="ergonomic-result-item">

                <strong>
                  Posture
                </strong>

                <span>
                  {result?.postureStatus}
                </span>

              </div>

              <div className="ergonomic-result-item">

                <strong>
                  Workstation
                </strong>

                <span>
                  {result?.workstationStatus}
                </span>

              </div>

              <div className="ergonomic-result-item">

                <strong>
                  Break habits
                </strong>

                <span>
                  {result?.breakStatus}
                </span>

              </div>

            </div>

            <div className="ergonomic-recommendations">

              {result?.recommendations?.map(
                (recommendation, index) => (
                  <div
                    key={index}
                  >

                    <span>
                      {String(
                        index + 1
                      ).padStart(
                        2,
                        "0"
                      )}
                    </span>

                    <p>
                      {recommendation}
                    </p>

                  </div>
                )
              )}

            </div>

            <div className="ergonomic-result-actions">

              <button
                type="button"
                className="ergonomic-recheck-button"
                onClick={
                  resetCheck
                }
              >
                <RotateCcw size={17} />
                Recheck
              </button>

              <Link
                to="/employee/dashboard"
                className="ergonomic-dashboard-button"
              >
                Back to Dashboard
              </Link>

            </div>

            <div className="ergonomic-notice">

              <ShieldCheck size={16} />

              <span>
                This result is a workplace screening
                indicator, not a medical diagnosis.
              </span>

            </div>

          </section>

        )}

      </main>

    </div>
  );
}

export default ErgonomicCheck;