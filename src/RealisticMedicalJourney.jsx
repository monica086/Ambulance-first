import { useState, useEffect, useRef, useCallback } from "react";
import "./RealisticMedicalJourney.css";

/* ─── asset map — verified filenames only ────────────── */
const JOURNEYS = {
  road: {
    title   : "Road Ambulance — Patient Journey",
    subtitle: "Emergency pickup · ground transport · hospital arrival",
    accent  : "#c0392b",
    phases  : [
      {
        src  : "/medical-journey/patient-stretcher.jpg",
        title: "Patient on Stretcher",
        desc : "Patient prepared on a stretcher beside the road ambulance for ground medical transportation.",
        tag  : "PHASE 1 · PATIENT PREPARATION",
      },
      {
        src  : "/medical-journey/patient-loading.jpg",
        title: "Loading Into Ambulance",
        desc : "Road ambulance crew safely loads the patient into the ambulance.",
        tag  : "PHASE 2 · LOADING",
      },
      {
        src  : "/medical-journey/ambulance-interior.jpg",
        title: "Continuous Medical Care",
        desc : "Patient receives monitoring and medical care inside the road ambulance.",
        tag  : "PHASE 3 · ONBOARD CARE",
      },
      {
        src  : "/medical-journey/ambulance-in-transit.jpg",
        title: "Ambulance In Transit",
        desc : "Road ambulance travels toward the destination hospital.",
        tag  : "PHASE 4 · IN TRANSIT",
      },
      {
        src  : "/medical-journey/hospital-arrival.jpg",
        title: "Hospital Arrival",
        desc : "Road ambulance arrives at the hospital with the receiving medical team ready.",
        tag  : "PHASE 5 · ARRIVAL",
      },
      {
        src  : "/medical-journey/patient-transfer.jpg",
        title: "Patient Handover",
        desc : "Patient is transferred from the road ambulance to the hospital medical team.",
        tag  : "PHASE 6 · HANDOVER",
      },
    ],
  },

  air: {
    title   : "Air Ambulance — Patient Journey",
    subtitle: "Emergency air transfer · in-flight care · hospital helipad",
    accent  : "#1565a8",
    phases  : [
      {
        src  : "/medical-journey/air-patient-stretcher.jpg",
        title: "Patient on Stretcher",
        desc : "Patient and air medical team prepare for transport by medical aircraft.",
        tag  : "PHASE 1 · PATIENT PREPARATION",
      },
      {
        src  : "/medical-journey/air-patient-loading.jpg",
        title: "Loading Into Air Ambulance",
        desc : "Air medical crew safely boards the patient into the medical aircraft.",
        tag  : "PHASE 2 · LOADING",
      },
      {
        src  : "/medical-journey/air-ambulance-interior.jpg",
        title: "In-Flight Medical Care",
        desc : "Patient receives medical care and monitoring inside the air ambulance.",
        tag  : "PHASE 3 · ONBOARD CARE",
      },
      {
        src  : "/medical-journey/air-ambulance-in-transit.jpg",
        title: "Air Ambulance In Transit",
        desc : "Medical helicopter travels through the air toward the destination.",
        tag  : "PHASE 4 · IN FLIGHT",
      },
      {
        src  : "/medical-journey/air-hospital-arrival.jpg",
        title: "Hospital Helipad Arrival",
        desc : "Medical aircraft arrives at the hospital helipad with the receiving team ready.",
        tag  : "PHASE 5 · ARRIVAL",
      },
      {
        src  : "/medical-journey/air-patient-transfer.jpg",
        title: "Patient Transfer to Hospital",
        desc : "Patient transfers from the air ambulance stretcher to hospital care.",
        tag  : "PHASE 6 · HANDOVER",
      },
    ],
  },

  train: {
    title   : "Train Ambulance — Patient Journey",
    subtitle: "Vande Bharat Express · medical escort · destination hospital",
    accent  : "#1a5c3a",
    phases  : [
      {
        src  : "/medical-journey/train-patient-stretcher.jpg",
        title: "Patient on Stretcher",
        desc : "Patient on a stretcher with the medical escort preparing for train transportation.",
        tag  : "PHASE 1 · PATIENT PREPARATION",
      },
      {
        src  : "/medical-journey/train-patient-loading.jpg",
        title: "Boarding the Train",
        desc : "Patient is safely boarded onto the train with the medical escort.",
        tag  : "PHASE 2 · BOARDING",
      },
      {
        src  : "/medical-journey/train-medical-compartment.jpg",
        title: "Medical Care Compartment",
        desc : "Patient receives care in the train's dedicated medical compartment with monitoring and medical staff.",
        tag  : "PHASE 3 · ONBOARD CARE",
      },
      {
        src  : "/medical-journey/train-in-transit.jpg",
        title: "Train In Transit",
        desc : "Vande Bharat train travels toward the destination during the medically supported journey.",
        tag  : "PHASE 4 · IN TRANSIT",
      },
      {
        src  : "/medical-journey/train-arrival.jpg",
        title: "Arrived at Destination",
        desc : "Train reaches the destination station where the receiving team is ready.",
        tag  : "PHASE 5 · ARRIVAL",
      },
      {
        src  : "/medical-journey/train-patient-care-latest.webp",
        title: "Patient Transfer to Hospital",
        desc : "After the rail journey, the medical escort coordinates the patient's onward transfer and handover to hospital care.",
        tag  : "PHASE 6 · HANDOVER",
      },
    ],
  },
};

const PHASE_DURATION = 4200; // ms per phase
const STEP_LABELS    = ["Preparation", "Loading", "Onboard Care", "In Transit", "Arrival", "Handover"];

/* ─── Ken Burns direction per phase slot ─────────────── */
const KB_VARIANTS = [
  "rmj-kb-zoomIn",
  "rmj-kb-panRight",
  "rmj-kb-zoomOut",
  "rmj-kb-panLeft",
  "rmj-kb-zoomIn",
  "rmj-kb-panRight",
];

function JourneyPhaseVisual({ phase, phaseIndex }) {
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setMissing(false);
  }, [phase.src]);

  if (missing) {
    return (
      <div className="rmj-missing-asset" role="img" aria-label={`Missing image for ${phase.title}: ${phase.src}`}>
        <span>IMAGE REQUIRED</span>
        <strong>{phase.title}</strong>
        <code>{phase.src}</code>
      </div>
    );
  }

  return (
    <img
      src={phase.src}
      alt={phase.title}
      className={`rmj-img ${KB_VARIANTS[phaseIndex % KB_VARIANTS.length]}`}
      onError={() => setMissing(true)}
    />
  );
}

export default function RealisticMedicalJourney({ serviceKey }) {
  const journey = JOURNEYS[serviceKey];
  if (!journey) return null;

  const { phases, title, subtitle, accent } = journey;
  const total = phases.length;

  const [phase, setPhase]     = useState(0);
  const [prev, setPrev]       = useState(null);   // previous phase index for crossfade-out
  const [fading, setFading]   = useState(false);  // true while crossfade is running
  const [done, setDone]       = useState(false);
  const [pct, setPct]         = useState(0);
  const timerRef              = useRef(null);
  const rafRef                = useRef(null);
  const startRef              = useRef(null);

  const clearAll = () => {
    clearTimeout(timerRef.current);
    cancelAnimationFrame(rafRef.current);
  };

  /* progress ticker within current phase */
  const tickProgress = useCallback((phaseIndex) => {
    startRef.current = performance.now();
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const base    = (phaseIndex / total) * 100;
      const span    = (1 / total) * 100;
      setPct(Math.min(base + (elapsed / PHASE_DURATION) * span, base + span));
      if (elapsed < PHASE_DURATION) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [total]);

  const goToPhase = useCallback((idx) => {
    clearAll();
    if (idx >= total) {
      setPct(100);
      setDone(true);
      return;
    }
    /* crossfade: mark previous, start fade */
    setPrev(phase);
    setFading(true);
    setTimeout(() => { setPrev(null); setFading(false); }, 600);

    setPhase(idx);
    setDone(false);
    tickProgress(idx);

    timerRef.current = setTimeout(() => goToPhase(idx + 1), PHASE_DURATION);
  }, [phase, total, tickProgress]); // eslint-disable-line

  const replay = useCallback(() => {
    clearAll();
    setPrev(null);
    setFading(false);
    setDone(false);
    setPct(0);
    setPhase(0);
    tickProgress(0);
    timerRef.current = setTimeout(() => goToPhase(1), PHASE_DURATION);
  }, [tickProgress, goToPhase]);

  /* auto-start */
  useEffect(() => {
    tickProgress(0);
    timerRef.current = setTimeout(() => goToPhase(1), PHASE_DURATION);
    return clearAll;
  }, []); // eslint-disable-line

  const current = phases[phase];
  const prevPhase = prev !== null ? phases[prev] : null;

  return (
    <div className="rmj" style={{ "--rmj-accent": accent }}>
      {/* header */}
      <div className="rmj-head">
        <span className="rmj-tag">{current.tag}</span>
        <h2 className="rmj-title">{done ? "✓ Journey Completed" : current.title}</h2>
        <p className="rmj-sub">{done ? "Patient successfully transported to hospital care." : current.desc}</p>
        {current.disclaimer && !done && (
          <p className="rmj-disclaimer">{current.disclaimer}</p>
        )}
      </div>

      {/* cinematic stage */}
      <div className="rmj-stage">
        {/* outgoing photo — fades out */}
        {fading && prevPhase && (
          <div className="rmj-frame rmj-frame-out" key={`out-${prev}`}>
            <JourneyPhaseVisual phase={prevPhase} phaseIndex={prev} />
          </div>
        )}

        {/* incoming photo — fades in + Ken Burns */}
        {!done && (
          <div className="rmj-frame rmj-frame-in" key={`in-${phase}`}>
            <JourneyPhaseVisual phase={current} phaseIndex={phase} />
            <div className="rmj-vignette" />
          </div>
        )}

        {/* completed overlay */}
        {done && (
          <div className="rmj-done">
            <div className="rmj-done-badge">
              <span className="rmj-done-check">✓</span>
              <strong>Journey Completed</strong>
              <span>Patient Successfully Transported</span>
            </div>
          </div>
        )}

        {/* service label bottom-left */}
        <div className="rmj-service-label">{title}</div>
      </div>

      {/* step tracker */}
      <div className="rmj-steps">
        {STEP_LABELS.map((label, i) => (
          <button
            key={label}
            className={`rmj-step${i < phase || done ? " rmj-step-done" : i === phase && !done ? " rmj-step-now" : ""}`}
            onClick={() => { if (!done) goToPhase(i); else { replay(); } }}
            aria-label={`Go to: ${label}`}
          >
            <span className="rmj-dot" />
            <span className="rmj-step-label">{label}</span>
            {i < STEP_LABELS.length - 1 && <span className="rmj-step-line" />}
          </button>
        ))}
      </div>

      {/* progress bar */}
      <div className="rmj-bar">
        <div className="rmj-bar-fill" style={{ width: `${pct}%` }} />
      </div>

      {/* footer */}
      <div className="rmj-footer">
        {done
          ? <button className="rmj-replay" onClick={replay}>↻ Replay Journey</button>
          : <span className="rmj-running">Journey in progress…</span>
        }
      </div>
    </div>
  );
}
