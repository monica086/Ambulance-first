import { useEffect, useRef, useState, useCallback } from "react";

/* ── Phase data — all photos, no video ───────────────── */
const PHASES = [
  {
    src      : "/medical-journey/patient-stretcher.jpg",
    label    : "PHASE 1 OF 6",
    title    : "Emergency Patient Pickup",
    desc     : "Patient safely prepared for emergency transportation.",
    duration : 4000,
  },
  {
    src      : "/medical-journey/patient-loading.jpg",
    label    : "PHASE 2 OF 6",
    title    : "Loading Into Ambulance",
    desc     : "Medical professionals carefully transfer the patient into the ambulance.",
    duration : 4000,
  },
  {
    src      : "/medical-journey/ambulance-interior.jpg",
    label    : "PHASE 3 OF 6",
    title    : "Continuous Medical Care",
    desc     : "Medical support continues throughout the journey.",
    duration : 4000,
  },
  {
    src      : "/medical-journey/ambulance-in-transit.jpg",
    label    : "PHASE 4 OF 6",
    title    : "Ambulance In Transit",
    desc     : "Rapid and safe transportation to the destination hospital.",
    duration : 4000,
  },
  {
    src      : "/medical-journey/hospital-arrival.jpg",
    label    : "PHASE 5 OF 6",
    title    : "Hospital Arrival",
    desc     : "The ambulance reaches the destination hospital safely.",
    duration : 4000,
  },
  {
    src      : "/medical-journey/patient-transfer.jpg",
    label    : "PHASE 6 OF 6",
    title    : "Patient Handover",
    desc     : "The patient is transferred safely to the hospital medical team.",
    duration : 4000,
  },
];

const STEP_LABELS = [
  "Patient Pickup",
  "Loading",
  "Medical Care",
  "In Transit",
  "Hospital",
  "Handover",
];

export default function RoadJourneyShowcase() {
  const [phase, setPhase] = useState(0);
  const [done, setDone]   = useState(false);
  const [imgKey, setImgKey] = useState(0);

  const timerRef = useRef(null);
  const current  = PHASES[phase];

  /* ── advance ─────────────────────────────────────────── */
  const advance = useCallback((toPhase) => {
    clearTimeout(timerRef.current);
    if (toPhase >= PHASES.length) { setDone(true); return; }
    setPhase(toPhase);
    setImgKey(k => k + 1);
  }, []);

  /* ── auto-advance timer ──────────────────────────────── */
  useEffect(() => {
    if (done) return;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => advance(phase + 1), current.duration);
    return () => clearTimeout(timerRef.current);
  }, [phase, done, current, advance]);

  /* ── replay ──────────────────────────────────────────── */
  const replay = () => {
    clearTimeout(timerRef.current);
    setDone(false);
    setPhase(0);
    setImgKey(k => k + 1);
  };

  /* ── manual nav ──────────────────────────────────────── */
  const goTo = (i) => {
    if (done) setDone(false);
    clearTimeout(timerRef.current);
    advance(i);
  };

  const overallPct = done ? 100 : (phase / PHASES.length) * 100;

  return (
    <div className="rjsWrap">
      {/* Header */}
      <div className="rjsHeader">
        <span className="rjsHeaderLabel">ROAD AMBULANCE · EMERGENCY JOURNEY</span>
        <h2 className="rjsHeaderTitle">
          {done ? "✓ Emergency Journey Completed" : current.title}
        </h2>
        <p className="rjsHeaderDesc">
          {done ? "Patient safely transferred to hospital care." : current.desc}
        </p>
      </div>

      {/* Stage */}
      <div className="rjsStage">
        {!done && (
          <div className="rjsImgFrame" key={imgKey}>
            <img src={current.src} alt={current.title} className="rjsImg" />
            <div className="rjsImgOverlay" />
            <span className="rjsPhaseLabel">{current.label}</span>
          </div>
        )}

        {done && (
          <div className="rjsDone">
            <div className="rjsDoneBadge">
              <span className="rjsDoneCheck">✓</span>
              <strong>Emergency Journey Completed</strong>
              <span>Patient safely transferred to hospital care.</span>
            </div>
          </div>
        )}
      </div>

      {/* Step tracker */}
      <div className="rjsSteps">
        {STEP_LABELS.map((label, i) => (
          <button
            key={label}
            className={`rjsStep${i < phase || done ? " rjsStepDone" : i === phase && !done ? " rjsStepNow" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to phase: ${label}`}
          >
            <span className="rjsStepDot" />
            <span className="rjsStepLabel">{label}</span>
            {i < STEP_LABELS.length - 1 && <span className="rjsStepLine" />}
          </button>
        ))}
      </div>

      {/* Overall progress bar */}
      <div className="rjsProgressWrap">
        <div className="rjsProgressFill" style={{ width: `${overallPct}%` }} />
      </div>

      {/* Footer controls */}
      <div className="rjsFooter">
        <div className="rjsNavBtns">
          <button
            className="rjsNavBtn"
            onClick={() => goTo(Math.max(0, phase - 1))}
            disabled={phase === 0 && !done}
          >
            ← Previous
          </button>
          {!done && (
            <button
              className="rjsNavBtn rjsNavBtnNext"
              onClick={() => advance(phase + 1)}
            >
              Next →
            </button>
          )}
        </div>
        {done && (
          <button className="rjsReplayBtn" onClick={replay}>
            ↻ Replay Journey
          </button>
        )}
      </div>
    </div>
  );
}
