import { useState, useEffect, useRef } from "react";
import "./journey.css";

/* ─── asset map — each service uses its own images ───── */
const IMG = {
  /* ROAD */
  roadPickup   : "/assets/services/patient-stretcher.jpg",   // patient on stretcher, road pickup
  roadAmbExt   : "/assets/services/road-ambulance.jpg",      // road ambulance exterior
  roadAmbInt   : "/assets/services/ambulance-interior.jpg",  // patient inside road ambulance
  /* AIR */
  airPickup    : "/assets/services/patient-care.jpg",        // patient + medical staff, air pickup
  airExt       : "/assets/services/air-ambulance.jpg",       // medical aircraft exterior
  airInt       : "/assets/services/air-medical-interior.jpg",// patient inside aircraft
  /* TRAIN */
  trainPickup  : "/assets/services/train-medical-care.jpg",  // patient at railway station
  trainExt     : "/assets/services/vande-bharat.jpg",
  trainInt     : "/assets/services/medical-care.jpg",        // medical care compartment concept
  /* SHARED */
  hospital     : "/assets/services/hospital.jpg",            // destination hospital
};

/*
  6 phases per service (index 0–5):
  0  Critical patient at pickup
  1  Loading patient into vehicle
  2  Patient inside vehicle receiving care
  3  Vehicle travelling
  4  Arrival at hospital/destination
  5  Patient transferred → completed
*/
const PHASE_DURATION = [2800, 2200, 2600, 5000, 2200, 2200]; // ms each
const TOTAL = PHASE_DURATION.reduce((a, b) => a + b, 0); // 17000 ms

function phaseAtElapsed(e) {
  let acc = 0;
  for (let i = 0; i < PHASE_DURATION.length; i++) {
    acc += PHASE_DURATION[i];
    if (e < acc) return i;
  }
  return PHASE_DURATION.length;
}

function phaseStartPct(idx) {
  let acc = 0;
  for (let i = 0; i < idx; i++) acc += PHASE_DURATION[i];
  return (acc / TOTAL) * 100;
}

/* ─── progress bar ───────────────────────────────────── */
function Bar({ pct }) {
  return (
    <div className="jBar">
      <div className="jBarFill" style={{ width: `${pct}%` }} />
    </div>
  );
}

/* ─── step tracker ───────────────────────────────────── */
function Steps({ labels, active }) {
  return (
    <div className="jStepRow">
      {labels.map((l, i) => (
        <div key={l} className={`jSt${i < active ? " jStDone" : i === active ? " jStNow" : ""}`}>
          <span className="jStDot" />
          <span className="jStLbl">{l}</span>
          {i < labels.length - 1 && <span className="jStLine" />}
        </div>
      ))}
    </div>
  );
}

/* ─── reusable photo card ────────────────────────────── */
function PhotoCard({ src, alt, label, disclaimer, visible, className = "" }) {
  return (
    <div className={`jCard ${className}${visible ? " jCardIn" : " jCardOut"}`}>
      <img src={src} alt={alt} />
      {label && <span className="jCardLabel">{label}</span>}
      {disclaimer && <span className="jCardDisclaimer">{disclaimer}</span>}
    </div>
  );
}

/* ─── shared journey runner hook ─────────────────────── */
function useJourney() {
  const [phase, setPhase] = useState(0);
  const [pct, setPct]     = useState(0);
  const [done, setDone]   = useState(false);
  const refs              = useRef({ raf: null, started: false });

  const stop = () => {
    if (refs.current.raf) cancelAnimationFrame(refs.current.raf);
  };

  const run = () => {
    stop();
    setPhase(0); setPct(0); setDone(false);
    const start = performance.now();
    const tick = (now) => {
      const e = now - start;
      const p = Math.min((e / TOTAL) * 100, 100);
      setPct(p);
      const ph = phaseAtElapsed(e);
      if (ph >= PHASE_DURATION.length) {
        setPhase(PHASE_DURATION.length);
        setDone(true);
        return;
      }
      setPhase(ph);
      refs.current.raf = requestAnimationFrame(tick);
    };
    refs.current.raf = requestAnimationFrame(tick);
  };

  useEffect(() => {
    if (!refs.current.started) { refs.current.started = true; run(); }
    return stop;
  }, []); // eslint-disable-line

  /* travel progress 0–100 within phase 3 */
  const travelStart = phaseStartPct(3);
  const travelSpan  = (PHASE_DURATION[3] / TOTAL) * 100;
  const travelPct   = phase === 3
    ? Math.min(((pct - travelStart) / travelSpan) * 100, 100)
    : phase > 3 ? 100 : 0;

  return { phase, pct, done, run, travelPct };
}

/* ═══════════════════════════════════════════════════════
   ROAD AMBULANCE JOURNEY
═══════════════════════════════════════════════════════ */
function LegacyRoadJourney() {
  const { phase, pct, done, run, travelPct } = useJourney();

  /* ambulance x: parked left (phase 0-1), loading position (phase 1),
     moves right during travel (phase 3), parked at hospital (phase 4+) */
  const ambLeft = phase < 1 ? "4%"
    : phase === 1 ? "12%"
    : phase === 3 ? `${12 + travelPct * 0.72}%`
    : phase >= 4  ? "84%"
    : "12%";

  /* stretcher moves toward ambulance during loading (phase 1) */
  const stretcherX = phase === 1 ? "translateX(60px)" : "translateX(0)";

  const LABELS = ["Critical Patient", "Loading", "Onboard Care", "In Transit", "Hospital Arrival", "Patient Transfer"];

  const chips = [
    "🚑 Paramedics on scene — patient being prepared",
    "🚑 Patient being loaded into ambulance",
    "✚ Patient secured — medical monitoring active",
    "🚑 Ambulance en route to hospital",
    "🏥 Ambulance arrived — medical team ready",
    "✚ Patient being transferred to hospital care",
  ];

  return (
    <div className="jWrap">
      <div className="jHead">
        <h2 className="jTitle">Road Ambulance Journey</h2>
        <p className="jSub">Critical patient → road ambulance → hospital arrival</p>
      </div>

      <div className="jScene jSceneRoad">
        {/* sky */}
        <div className="jSky jSkyDay" />

        {/* scrolling road background during travel */}
        <div className={`jRoadBg${phase === 3 ? " jRoadScroll" : ""}`} />

        {/* ground */}
        <div className="jGround" />

        {/* road strip */}
        <div className="jRoad">
          <div className={`jDashes${phase === 3 ? " jDashMove" : ""}`} />
        </div>

        {/* PHASE 0 — critical patient at pickup */}
        <PhotoCard
          src={IMG.roadPickup} alt="Critically ill patient on stretcher"
          label="Critical Patient — Emergency Pickup"
          visible={phase <= 1}
          className="jCardLeft"
          style={{ transform: stretcherX }}
        />

        {/* PHASE 2 — patient inside ambulance */}
        <PhotoCard
          src={IMG.roadAmbInt} alt="Patient inside road ambulance receiving care"
          label="Patient Receiving Medical Care En Route"
          visible={phase === 2}
          className="jCardCenter"
        />

        {/* PHASE 4 — hospital arrival */}
        <PhotoCard
          src={IMG.hospital} alt="Destination hospital"
          label="Arrived at Destination Hospital"
          visible={phase >= 4}
          className="jCardRight"
        />

        {/* AMBULANCE — moves across scene */}
        <div
          className={`jVehicle jAmbVehicle${phase === 3 ? " jVehicleMove" : ""}`}
          style={{ left: ambLeft }}
        >
          <img src={IMG.roadAmbExt} alt="Road ambulance" />
          {phase === 3 && <div className="jSiren" />}
          {(phase === 1 || phase === 2) && (
            <div className="jLoadingArrow">↑ Loading</div>
          )}
        </div>

        {/* PHASE 5 — patient transfer out of ambulance */}
        <PhotoCard
          src={IMG.roadPickup} alt="Patient being transferred to hospital"
          label="Patient Transferred to Hospital"
          visible={phase >= 5}
          className="jCardRight jCardTransfer"
        />

        {!done && <div className="jChip">{chips[Math.min(phase, chips.length - 1)]}</div>}

        {done && (
          <div className="jDoneOverlay">
            <div className="jDoneBadge">
              <div>✓ Journey Completed</div>
              <div className="jDoneSub">Patient Successfully Transported</div>
            </div>
          </div>
        )}
      </div>

      <div className="jControls">
        <Steps labels={LABELS} active={Math.min(phase, LABELS.length - 1)} />
        <Bar pct={pct} />
        {done
          ? <button className="jReplay" onClick={run}>↻ Replay Journey</button>
          : <div className="jRunning">Journey in Progress…</div>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   AIR AMBULANCE JOURNEY
═══════════════════════════════════════════════════════ */
function LegacyAirJourney() {
  const { phase, pct, done, run, travelPct } = useJourney();

  /* aircraft position */
  const acLeft   = phase < 1 ? "5%"
    : phase === 1 ? "10%"
    : phase === 3 ? `${10 + travelPct * 0.74}%`
    : phase >= 4  ? "84%"
    : "10%";

  /* altitude: rises during first half of travel, descends second half */
  const altPct   = travelPct <= 50 ? travelPct / 50 : 1 - (travelPct - 50) / 50;
  const acBottom = phase === 3 ? `${24 + altPct * 30}%` : "24%";

  const LABELS = ["Critical Patient", "Loading", "Onboard Care", "In Flight", "Hospital Arrival", "Patient Transfer"];

  const chips = [
    "✚ Medical team preparing patient for air transport",
    "✈ Patient being loaded into air ambulance",
    "✚ Patient secured — medical monitoring active in flight",
    "✈ Aircraft in flight — medical team on board",
    "🏥 Aircraft landed at hospital helipad",
    "✚ Patient being transferred to hospital care",
  ];

  return (
    <div className="jWrap">
      <div className="jHead">
        <h2 className="jTitle">Air Ambulance Journey</h2>
        <p className="jSub">Critical patient → medical aircraft → hospital helipad</p>
      </div>

      <div className="jScene jSceneAir">
        <div className="jSky jSkyAir" />
        <div className="jGround" />

        {/* clouds animate during flight */}
        <div className={`jCloud jCloud1${phase === 3 ? " jCloudMove" : ""}`} />
        <div className={`jCloud jCloud2${phase === 3 ? " jCloudMove" : ""}`} />
        <div className={`jCloud jCloud3${phase === 3 ? " jCloudMove" : ""}`} />

        {/* helipad markers */}
        <div className="jHelipad jHelipadL"><div className="jHelipadMark">H</div></div>
        <div className="jHelipad jHelipadR"><div className="jHelipadMark">H</div></div>

        {/* PHASE 0 — critical patient at pickup (air-specific photo) */}
        <PhotoCard
          src={IMG.airPickup} alt="Critically ill patient — air ambulance pickup"
          label="Critical Patient — Emergency Air Transfer"
          visible={phase <= 1}
          className="jCardLeft"
        />

        {/* PHASE 2 — patient inside aircraft */}
        <PhotoCard
          src={IMG.airInt} alt="Patient inside medical aircraft receiving care"
          label="Patient Receiving Medical Care In Flight"
          visible={phase === 2}
          className="jCardCenter"
        />

        {/* PHASE 4 — hospital arrival */}
        <PhotoCard
          src={IMG.hospital} alt="Destination hospital helipad"
          label="Arrived at Destination Hospital"
          visible={phase >= 4}
          className="jCardRight"
        />

        {/* AIRCRAFT — moves and rises/descends */}
        <div
          className={`jVehicle jAircraftVehicle${phase === 3 ? " jAircraftFloat" : ""}`}
          style={{ left: acLeft, bottom: acBottom }}
        >
          <img src={IMG.airExt} alt="Air ambulance" />
          {(phase === 1 || phase === 2) && (
            <div className="jLoadingArrow">↑ Loading</div>
          )}
        </div>

        {/* PHASE 5 — patient transfer */}
        <PhotoCard
          src={IMG.airPickup} alt="Patient being transferred from aircraft to hospital"
          label="Patient Transferred to Hospital"
          visible={phase >= 5}
          className="jCardRight jCardTransfer"
        />

        {!done && <div className="jChip">{chips[Math.min(phase, chips.length - 1)]}</div>}

        {done && (
          <div className="jDoneOverlay">
            <div className="jDoneBadge">
              <div>✓ Journey Completed</div>
              <div className="jDoneSub">Patient Successfully Transported</div>
            </div>
          </div>
        )}
      </div>

      <div className="jControls">
        <Steps labels={LABELS} active={Math.min(phase, LABELS.length - 1)} />
        <Bar pct={pct} />
        {done
          ? <button className="jReplay" onClick={run}>↻ Replay Journey</button>
          : <div className="jRunning">Journey in Progress…</div>
        }
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
  TRAIN AMBULANCE JOURNEY
═══════════════════════════════════════════════════════ */
function LegacyTrainJourney() {
  const { phase, pct, done, run, travelPct } = useJourney();

  const trainLeft = phase < 1 ? "-5%"
    : phase === 1 ? "2%"
    : phase === 3 ? `${2 + travelPct * 0.82}%`
    : phase >= 4  ? "84%"
    : "2%";

  const LABELS = ["Critical Patient", "Boarding", "Medical Compartment", "Rail Journey", "Destination", "Patient Transfer"];

  const chips = [
    "🚆 Patient being prepared at origin station",
    "🚆 Patient being boarded onto the train",
    "✚ Patient in dedicated medical care compartment",
    "🚆 Train in transit — medical escort active",
    "🏥 Train arrived — patient being transferred",
    "✚ Patient transferred for hospital care",
  ];

  return (
    <div className="jWrap">
      <div className="jHead">
        <h2 className="jTitle">Train Ambulance Journey</h2>
        <p className="jSub">Critical patient → train → destination hospital</p>
      </div>

      <div className="jScene jSceneTrain">
        <div className="jSky jSkyTrain" />

        {/* scrolling landscape during travel */}
        <div className={`jLandscape${phase === 3 ? " jLandscapeScroll" : ""}`} />

        <div className="jGround" />

        {/* railway tracks */}
        <div className="jTrackWrap">
          <div className="jRail jRailT" />
          <div className="jRail jRailB" />
          <div className={`jSleepers${phase === 3 ? " jSleeperMove" : ""}`} />
        </div>

        {/* station labels */}
        <div className="jStation jStationL">Origin Station</div>
        <div className="jStation jStationR">Destination</div>

        {/* PHASE 0 — critical patient at railway station (train-specific photo) */}
        <PhotoCard
          src={IMG.trainPickup} alt="Critically ill patient at railway station"
          label="Critical Patient — Railway Medical Transfer"
          visible={phase <= 1}
          className="jCardLeft"
        />

        {/* PHASE 2 — medical care compartment */}
        <PhotoCard
          src={IMG.trainInt} alt="Medical care compartment inside train"
          label="Medical Care Compartment Concept"
          disclaimer="Conceptual medical-care compartment configuration"
          visible={phase === 2}
          className="jCardCenter"
        />

        {/* PHASE 4 — destination */}
        <PhotoCard
          src={IMG.hospital} alt="Destination hospital"
          label="Arrived at Destination"
          visible={phase >= 4}
          className="jCardRight"
        />

        {/* Train moves across the scene */}
        <div
          className="jVehicle jTrainVehicle"
          style={{ left: trainLeft }}
        >
          <img src={IMG.trainExt} alt="Medical transport train" />
          <div className="jMedBadge">✚ MEDICAL</div>
          {(phase === 1) && <div className="jLoadingArrow">↑ Boarding</div>}
        </div>

        {/* PHASE 5 — patient transfer */}
        <PhotoCard
          src={IMG.trainPickup} alt="Patient being transferred from train to hospital"
          label="Patient Transferred for Hospital Care"
          visible={phase >= 5}
          className="jCardRight jCardTransfer"
        />

        {!done && <div className="jChip">{chips[Math.min(phase, chips.length - 1)]}</div>}

        {done && (
          <div className="jDoneOverlay">
            <div className="jDoneBadge">
              <div>✓ Journey Completed</div>
              <div className="jDoneSub">Patient Successfully Transported</div>
            </div>
          </div>
        )}
      </div>

      <div className="jControls">
        <Steps labels={LABELS} active={Math.min(phase, LABELS.length - 1)} />
        <Bar pct={pct} />
        {done
          ? <button className="jReplay" onClick={run}>↻ Replay Journey</button>
          : <div className="jRunning">Journey in Progress…</div>
        }
      </div>
    </div>
  );
}

const STORY_DURATIONS = [2600, 1700, 2200, 2300, 5200, 1800, 2600];
const STORY_TOTAL = STORY_DURATIONS.reduce((sum, duration) => sum + duration, 0);

const STORIES = {
  road: {
    title: "Road Ambulance Journey",
    setting: "road",
    messages: [
      "ROAD ACCIDENT · CRITICAL PATIENT ON STRETCHER · MEDICAL TEAM IN ATTENDANCE",
      "ROAD AMBULANCE RUSHES TO THE INCIDENT",
      "MEDICAL TEAM RUSHES PATIENT THROUGH OPEN AMBULANCE DOORS",
      "PATIENT INSIDE · IV AND MEDICAL MONITORING ACTIVE",
      "ROAD AMBULANCE TRAVELLING TO THE DESTINATION",
      "AMBULANCE ARRIVED · HOSPITAL TEAM READY",
      "MEDICAL TEAM RUSHES THE STRETCHER THROUGH THE HOSPITAL ENTRANCE",
    ],
  },
  air: {
    title: "Air Ambulance Journey",
    setting: "air",
    messages: [
      "CRITICAL PATIENT · AIR MEDICAL TEAM PREPARING THE STRETCHER",
      "MEDICAL AIRCRAFT ARRIVING AT THE PICKUP HELIPAD",
      "PATIENT BEING LOADED INTO THE MEDICAL AIRCRAFT",
      "PATIENT INSIDE · IV AND IN-FLIGHT MONITORING ACTIVE",
      "AIR AMBULANCE IN FLIGHT TO THE DESTINATION HELIPAD",
      "AIRCRAFT LANDED · HOSPITAL TEAM READY",
      "PATIENT MOVING FROM AIRCRAFT TO HOSPITAL CARE",
    ],
  },
  train: {
    title: "Train Ambulance Journey",
    setting: "train",
    messages: [
      "CRITICAL PATIENT · MEDICAL TEAM PREPARING AT THE STATION",
      "TRAIN ARRIVING AT THE ORIGIN STATION",
      "STRETCHER BOARDING THE TRAIN",
      "PATIENT INSIDE · IV AND MEDICAL MONITORING ACTIVE",
      "TRAIN TRAVELLING ON RAILWAY TRACKS",
      "ARRIVED AT DESTINATION STATION",
      "PATIENT TRANSFERRED TOWARD HOSPITAL CARE",
    ],
  },
};

function storyPhase(elapsed) {
  let boundary = 0;
  for (let index = 0; index < STORY_DURATIONS.length; index += 1) {
    boundary += STORY_DURATIONS[index];
    if (elapsed < boundary) return index;
  }
  return STORY_DURATIONS.length;
}

function useCinematicJourney({ loop = false } = {}) {
  const [replayKey, setReplayKey] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [phase, setPhase] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let frame;
    let startedAt = performance.now();
    let lastUpdate = 0;
    let pausedAt = document.visibilityState === "hidden" ? startedAt : null;
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        pausedAt = performance.now();
      } else if (pausedAt !== null) {
        startedAt += performance.now() - pausedAt;
        pausedAt = null;
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    const tick = (now) => {
      if (loop && now - lastUpdate < 1000 / 24) {
        frame = requestAnimationFrame(tick);
        return;
      }
      lastUpdate = now;
      const nextElapsed = Math.min(now - startedAt, STORY_TOTAL);
      setElapsed(nextElapsed);
      setPhase(storyPhase(nextElapsed));
      if (nextElapsed >= STORY_TOTAL) {
        if (loop) {
          startedAt = now;
          setElapsed(0);
          setPhase(0);
          frame = requestAnimationFrame(tick);
          return;
        }
        setDone(true);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    setElapsed(0);
    setPhase(0);
    setDone(false);
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [loop, replayKey]);

  let phaseStart = 0;
  for (let index = 0; index < phase; index += 1) phaseStart += STORY_DURATIONS[index];
  const phaseProgress = phase < STORY_DURATIONS.length
    ? Math.min((elapsed - phaseStart) / STORY_DURATIONS[phase], 1)
    : 1;
  const travelStart = STORY_DURATIONS.slice(0, 4).reduce((sum, value) => sum + value, 0);
  const travelProgress = phase === 4
    ? Math.min((elapsed - travelStart) / STORY_DURATIONS[4], 1)
    : phase > 4 ? 1 : 0;

  return {
    phase,
    phaseProgress,
    travelProgress,
    progress: Math.min((elapsed / STORY_TOTAL) * 100, 100),
    done,
    replay: () => setReplayKey((key) => key + 1),
  };
}

function RoadAnimeScene({ phase, phaseProgress, travelProgress }) {
  const approaching = phase === 1;
  const loading = phase === 2;
  const onboard = phase === 3;
  const traveling = phase === 4;
  const arrival = phase >= 5;
  const transferring = phase === 6;
  const ambulanceX = phase === 0 ? 930
    : approaching ? 930 - phaseProgress * 520
      : traveling ? 410 + travelProgress * 405
        : arrival ? 815 : 410;
  const patientX = loading ? 130 + phaseProgress * 260
    : transferring ? 660 + phaseProgress * 210 : 135;
  const patientVisible = phase <= 2 || transferring;

  return (
    <svg className={`jRoadAnimeScene${traveling ? " jAnimeTravel" : ""}`} viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Animated road ambulance rushing a critical patient from a road accident to hospital">
      <defs>
        <linearGradient id="roadAnimeSky" x2="0" y2="1">
          <stop offset="0" stopColor="#263d55" />
          <stop offset=".58" stopColor="#607787" />
          <stop offset="1" stopColor="#d49b78" />
        </linearGradient>
        <linearGradient id="roadAnimeRoad" x2="0" y2="1">
          <stop offset="0" stopColor="#41494e" />
          <stop offset="1" stopColor="#20272d" />
        </linearGradient>
        <linearGradient id="roadAnimeVan" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" />
          <stop offset="1" stopColor="#dce5e8" />
        </linearGradient>
        <linearGradient id="roadAnimeCabin" x2="0" y2="1">
          <stop offset="0" stopColor="#31515b" />
          <stop offset="1" stopColor="#152c36" />
        </linearGradient>
        <filter id="roadAnimeShadow" x="-30%" y="-30%" width="160%" height="180%">
          <feGaussianBlur stdDeviation="8" />
        </filter>
        <clipPath id="roadAnimeWindow">
          <path d="M38 280h187v49H38z" />
        </clipPath>
      </defs>

      <rect width="1200" height="520" fill="url(#roadAnimeSky)" />
      <path d="M0 198 Q190 170 370 195 T760 188 T1200 194V340H0Z" fill="#3e505a" opacity=".48" />
      <g className={traveling ? "jAnimeParallax" : ""} fill="#344650" opacity=".8">
        <path d="M0 225h74v-94h38v94h46v-69h68v69h42v-117h55v117h52v-80h82v80h62v-122h48v122h54v-67h84v67h62v-104h62v104h50v-80h80v80h58v-125h64v125h76v130H0Z" />
        <path d="M0 286h1200v67H0Z" fill="#738077" opacity=".48" />
      </g>
      <g className="jAnimeHospital" opacity={arrival ? 1 : .1}>
        <path d="M936 204h220v176H936z" fill="#d9ded9" stroke="#f7f5ed" strokeWidth="5" />
        <path d="M920 204 1046 151l126 53Z" fill="#a9b5b5" stroke="#e8ece8" strokeWidth="5" />
        <path d="M1027 286h48v94h-48z" fill="#41616c" />
        <path d="M956 232h38v28h-38zm73 0h38v28h-38zm73 0h30v28h-30z" fill="#78a6b4" />
        <path d="M1064 168v30m-15-15h30" stroke="#bd3d3d" strokeWidth="8" />
        <path d="M936 380h220" stroke="#f2d6b0" strokeWidth="8" />
      </g>

      <g className="jAnimeIncident" opacity={phase <= 2 ? 1 : .2}>
        <path d="M24 340h202l-17-35h-50l-25-25H71l-27 25H24Z" fill="#555d61" stroke="#20292e" strokeWidth="5" />
        <path d="m74 305 22-19h34l20 19m-113 14h185" fill="none" stroke="#96a0a1" strokeWidth="4" />
        <path d="m192 326 22 5-5 13-25-5" fill="#d57c45" />
        <circle cx="73" cy="341" r="16" fill="#20272d" stroke="#aeb8b8" strokeWidth="5" />
        <circle cx="175" cy="341" r="16" fill="#20272d" stroke="#aeb8b8" strokeWidth="5" />
        <path d="m205 277 20-24m-3 25 30-16" stroke="#e6b56e" strokeWidth="4" strokeLinecap="round" />
      </g>

      <path d="M0 367h1200v153H0Z" fill="#555d54" />
      <path d="M0 409h1200v111H0Z" fill="url(#roadAnimeRoad)" />
      <path d="M0 407h1200M0 517h1200" stroke="#e7c66d" strokeWidth="5" />
      <g className={traveling ? "jAnimeRoadLines jAnimeRoadLinesMoving" : "jAnimeRoadLines"} fill="#f5efe0">
        <path d="M-120 457h150v7h-150zm240 0h150v7H120zm240 0h150v7H360zm240 0h150v7H600zm240 0h150v7H840zm240 0h150v7h-150z" />
      </g>

      <g className="jAnimeAmbulance" transform={`translate(${ambulanceX} 0)`}>
        <ellipse cx="180" cy="390" rx="190" ry="14" fill="#111a20" opacity=".62" filter="url(#roadAnimeShadow)" />
        <path d="M4 278q0-12 14-12h215q18 0 33 15l42 38q12 10 12 27v30H4Z" fill="url(#roadAnimeVan)" stroke="#263640" strokeWidth="5" />
        <path d="M18 314h264v26H18z" fill="#c9453d" />
        <path d="M258 278h-53v-12h28q14 0 25 12Z" fill="#f4f6f4" />
        <g className={onboard || traveling ? "jAnimeCabinVisible" : "jAnimeCabinHidden"} clipPath="url(#roadAnimeWindow)">
          <path d="M35 277h194v57H35z" fill="url(#roadAnimeCabin)" />
          <path d="M46 321h164" stroke="#d9e4e3" strokeWidth="5" />
          <path d="M76 303h78q10 0 10 9v8H72v-8q0-9 4-9Z" fill="#e6e7de" />
          <circle cx="72" cy="299" r="9" fill="#e0ae88" />
          <path d="M83 296h47q17 0 21 9l-10 8H86Z" fill="#f1f3ed" />
          <path d="M104 312v8m40-8v8" stroke="#b64d47" strokeWidth="3" />
          <path d="M178 282v15m-9 0h18v21h-18z" fill="#91a99e" stroke="#dce8e3" strokeWidth="2" />
          <path d="M174 307q4-8 8 0t9 0" fill="none" stroke="#b84641" strokeWidth="2" />
          <path d="M60 282v14m-8-14h16" stroke="#e2bd62" strokeWidth="3" />
        </g>
        <path d="M18 276v92M224 274v94M252 281l42 38" fill="none" stroke="#b4c0c3" strokeWidth="5" />
        <path d="M18 277h200" stroke="#fff" strokeWidth="4" />
        <path d="M276 286h24l25 35h-50z" fill="#9bc0cb" stroke="#263640" strokeWidth="4" />
        <path d="M282 345h34v12h-34z" fill="#f6e6bd" />
        <path d="M11 348h15v11H11zm313 0h12v11h-12z" fill="#e45a4c" />
        <path d="M126 284v20m-10-10h20" stroke="#c9453d" strokeWidth="6" />
        <g className="jAnimeBeacon">
          <rect x="66" y="254" width="24" height="10" rx="3" fill="#df5145" />
          <rect x="91" y="254" width="24" height="10" rx="3" fill="#538db3" />
        </g>
        {loading && <g className="jAnimeOpenDoors">
          <path d="M4 278h20v80H4z" fill="#27404a" stroke="#e8edef" strokeWidth="3" transform="skewY(-13) translate(-14 65)" />
          <path d="M27 280v78" stroke="#b7c3c4" strokeWidth="4" />
        </g>}
        <g className={traveling ? "jAnimeWheel jAnimeWheelMoving" : "jAnimeWheel"}>
          <circle cx="76" cy="371" r="25" fill="#20272d" stroke="#cbd3d3" strokeWidth="5" />
          <circle cx="76" cy="371" r="8" fill="#899599" />
          <path d="M76 350v42m-21-21h42" stroke="#899599" strokeWidth="3" />
        </g>
        <g className={traveling ? "jAnimeWheel jAnimeWheelMoving" : "jAnimeWheel"}>
          <circle cx="274" cy="371" r="25" fill="#20272d" stroke="#cbd3d3" strokeWidth="5" />
          <circle cx="274" cy="371" r="8" fill="#899599" />
          <path d="M274 350v42m-21-21h42" stroke="#899599" strokeWidth="3" />
        </g>
      </g>

      {patientVisible && (
        <g className={`jAnimePatient${loading ? " jAnimePatientLoading" : ""}${transferring ? " jAnimePatientTransfer" : ""}`} transform={`translate(${patientX} 0)`}>
          <path d="M6 359h230M20 359v29m206-29v29" stroke="#d8e2e3" strokeWidth="6" strokeLinecap="round" />
          <rect x="11" y="340" width="216" height="18" rx="7" fill="#e5e9e7" stroke="#364850" strokeWidth="3" />
          <circle cx="35" cy="318" r="15" fill="#e0b18f" stroke="#7c4d47" strokeWidth="3" />
          <path d="M49 308q48-20 103 4l20 26H47Z" fill="#e7e9e4" stroke="#52636b" strokeWidth="3" />
          <path d="M99 313h48l22 25H92Z" fill="#b84743" />
          <path d="M132 314v20m-8-10h16" stroke="#fff" strokeWidth="4" />
          <path d="M170 339v-34m0 0q0-8 8-8h14" fill="none" stroke="#dce5e4" strokeWidth="3" />
          <path d="M189 294h25v35h-25z" fill="#9ab4b6" stroke="#344850" strokeWidth="3" />
          <path d="M194 316q5-15 10 0t9 0" fill="none" stroke="#277b76" strokeWidth="2" />
          <g className="jAnimeMedic">
            <circle cx="221" cy="294" r="13" fill="#d9a17f" />
            <path d="M207 311q17-8 31 4l9 34h-48Z" fill="#39788a" stroke="#203b46" strokeWidth="3" />
            <path d="M209 323 186 342m37-10 10 24" fill="none" stroke="#d9a17f" strokeWidth="8" strokeLinecap="round" />
            <path d="M213 291q5-17 19-7" fill="none" stroke="#1c2930" strokeWidth="6" />
          </g>
          {phase === 0 && <g className="jAnimeMedic jAnimeMedicSecond">
            <circle cx="-18" cy="310" r="13" fill="#d8a07d" />
            <path d="M-31 327q15-8 28 4l8 27h-44Z" fill="#315f71" stroke="#203b46" strokeWidth="3" />
            <path d="m-28 339 24 7" stroke="#d8a07d" strokeWidth="8" strokeLinecap="round" />
            <path d="M-29 307q5-16 18-7" fill="none" stroke="#1c2930" strokeWidth="6" />
          </g>}
        </g>
      )}

      {onboard && (
        <g className="jAnimeInteriorPanel">
          <rect x="152" y="77" width="890" height="286" rx="10" fill="#142b35" stroke="#d9e3e0" strokeWidth="5" />
          <path d="M165 105h865v39H165z" fill="#36515b" />
          <text x="188" y="131" fill="#f2c977" fontSize="15" fontWeight="700" letterSpacing="3">ROAD AMBULANCE · ONBOARD CRITICAL CARE</text>
          <path d="M229 308h556v18H229zM264 326v24m475-24v24" stroke="#dce5e2" strokeWidth="6" strokeLinecap="round" />
          <rect x="251" y="277" width="472" height="28" rx="10" fill="#d8e0dd" />
          <circle cx="309" cy="244" r="24" fill="#e0b18f" stroke="#6f4843" strokeWidth="4" />
          <path d="M333 227q113-27 256 20l35 30H329Z" fill="#f0f0e9" stroke="#819398" strokeWidth="4" />
          <path d="M542 239h79l35 38H538Z" fill="#b84743" />
          <path d="M579 243v29m-11-14h22" stroke="#fff" strokeWidth="5" />
          <path d="M742 270v-93m0 9q0-18 18-18h31" stroke="#dce5e2" strokeWidth="4" />
          <path d="M792 164h52v74h-52z" fill="#abc2bd" stroke="#edf2ed" strokeWidth="4" />
          <path d="M800 211q10-34 19 0t18 0t10 0" fill="none" stroke="#358d7e" strokeWidth="4" />
          <circle cx="890" cy="216" r="25" fill="#dda784" />
          <path d="M862 245q29-20 58 1l28 62h-112Z" fill="#39788a" stroke="#203b46" strokeWidth="4" />
          <path d="m873 264-63 24m121-17 31 31" fill="none" stroke="#dda784" strokeWidth="12" strokeLinecap="round" />
          <path d="M869 211q8-30 37-21" fill="none" stroke="#202c32" strokeWidth="8" />
          <rect x="946" y="171" width="65" height="84" rx="5" fill="#243f48" stroke="#c9d9d5" strokeWidth="3" />
          <path d="M954 221q10-35 20 0t17 0t15 0" fill="none" stroke="#4ab79d" strokeWidth="4" />
          <text x="942" y="270" fill="#f4f3e9" fontSize="11" fontWeight="700">ECG / O₂</text>
        </g>
      )}
    </svg>
  );
}

function AnimeStretcher({ x, y = 0, running = false }) {
  return (
    <g className={running ? "jAnimePatientLoading" : ""} transform={`translate(${x} ${y})`}>
      <path d="M6 359h230M20 359v29m206-29v29" stroke="#d8e2e3" strokeWidth="6" strokeLinecap="round" />
      <rect x="11" y="340" width="216" height="18" rx="7" fill="#e5e9e7" stroke="#364850" strokeWidth="3" />
      <circle cx="35" cy="318" r="15" fill="#e0b18f" stroke="#7c4d47" strokeWidth="3" />
      <path d="M49 308q48-20 103 4l20 26H47Z" fill="#e7e9e4" stroke="#52636b" strokeWidth="3" />
      <path d="M99 313h48l22 25H92Z" fill="#b84743" />
      <path d="M132 314v20m-8-10h16" stroke="#fff" strokeWidth="4" />
      <path d="M170 339v-34m0 0q0-8 8-8h14" fill="none" stroke="#dce5e4" strokeWidth="3" />
      <path d="M189 294h25v35h-25z" fill="#9ab4b6" stroke="#344850" strokeWidth="3" />
      <path d="M194 316q5-15 10 0t9 0" fill="none" stroke="#277b76" strokeWidth="2" />
      <g className="jAnimeMedic">
        <circle cx="221" cy="294" r="13" fill="#d9a17f" />
        <path d="M207 311q17-8 31 4l9 34h-48Z" fill="#39788a" stroke="#203b46" strokeWidth="3" />
        <path d="M209 323 186 342m37-10 10 24" fill="none" stroke="#d9a17f" strokeWidth="8" strokeLinecap="round" />
        <path d="M213 291q5-17 19-7" fill="none" stroke="#1c2930" strokeWidth="6" />
      </g>
    </g>
  );
}

function AirAnimeScene({ phase, phaseProgress, travelProgress }) {
  const loading = phase === 2;
  const onboard = phase === 3;
  const traveling = phase === 4;
  const arrival = phase >= 5;
  const transferring = phase === 6;
  const aircraftX = phase === 0 ? -390
    : phase === 1 ? -390 + phaseProgress * 770
      : traveling ? 380 + travelProgress * 310
        : arrival ? 690 : 380;
  const aircraftY = traveling ? 50 - Math.sin(travelProgress * Math.PI) * 120 : phase >= 2 ? 50 : 0;
  const patientX = loading ? 130 + phaseProgress * 255 : transferring ? 650 + phaseProgress * 215 : 135;

  return (
    <svg className={`jRoadAnimeScene jAirAnimeScene${traveling ? " jAnimeAirTravel" : ""}`} viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Animated air ambulance carrying a critical patient to a hospital helipad">
      <defs>
        <linearGradient id="airAnimeSky" x2="0" y2="1"><stop stopColor="#284864" /><stop offset=".68" stopColor="#78a5ba" /><stop offset="1" stopColor="#d4c1a0" /></linearGradient>
        <linearGradient id="airAnimeBody" x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#dbe5e7" /></linearGradient>
        <linearGradient id="airAnimeCabin" x2="0" y2="1"><stop stopColor="#365864" /><stop offset="1" stopColor="#172d38" /></linearGradient>
        <clipPath id="airAnimeWindow"><path d="M157 263h166v51H157z" /></clipPath>
      </defs>
      <rect width="1200" height="520" fill="url(#airAnimeSky)" />
      <g className={traveling ? "jAnimeCloudTravel" : ""} fill="#e7edf0" opacity=".66">
        <path d="M85 135q8-31 40-27 20-42 65-13 36-7 40 32h40v22H85Zm560-48q9-28 38-24 20-37 59-10 32-5 38 27h42v20H645Zm310 90q6-25 33-22 18-34 53-9 28-5 33 25h36v19H955Z" />
      </g>
      <path d="M0 358q166-44 335 2t340 0 525-5v165H0Z" fill="#576a63" />
      <g className={`jAnimeHospital${arrival ? " jAnimeHospitalArrived" : ""}`} opacity={arrival ? 1 : .1}>
        <path d="M936 204h220v176H936z" fill="#d9ded9" stroke="#f7f5ed" strokeWidth="5" />
        <path d="M920 204 1046 151l126 53Z" fill="#a9b5b5" stroke="#e8ece8" strokeWidth="5" />
        <path d="M1027 286h48v94h-48z" fill="#41616c" />
        <path d="M956 232h38v28h-38zm73 0h38v28h-38zm73 0h30v28h-30z" fill="#78a6b4" />
        <path d="M1064 168v30m-15-15h30" stroke="#bd3d3d" strokeWidth="8" />
      </g>
      <path d="M0 390h1200v130H0Z" fill="#343b3e" />
      <path d="M0 390h1200" stroke="#f0d381" strokeWidth="5" />
      <ellipse cx="565" cy="409" rx="120" ry="24" fill="#667174" stroke="#e8e8df" strokeWidth="4" />
      <ellipse cx="565" cy="409" rx="82" ry="16" fill="none" stroke="#d1d9d6" strokeWidth="3" />
      <text x="548" y="416" fill="#f2f3ed" fontSize="18" fontWeight="800">H</text>
      <g className="jAnimeHospital" opacity={arrival ? 1 : 0}>
        <ellipse cx="900" cy="409" rx="116" ry="23" fill="#667174" stroke="#e8e8df" strokeWidth="4" />
        <ellipse cx="900" cy="409" rx="78" ry="15" fill="none" stroke="#d1d9d6" strokeWidth="3" />
        <text x="891" y="416" fill="#f2f3ed" fontSize="18" fontWeight="800">H</text>
      </g>
      <g className="jAnimeAircraft" transform={`translate(${aircraftX} ${aircraftY})`}>
        <path d="M26 284h102l72-25h173q48 0 73 25-24 26-73 26H201l-73-21H26Z" fill="url(#airAnimeBody)" stroke="#263c48" strokeWidth="5" />
        <path d="m160 276 64-96 25 4-31 97m-58 15 64 94 25-4-31-93" fill="#d9e3e5" stroke="#344b56" strokeWidth="4" />
        <path d="M108 281 67 243l-17 4 24 38m34 14-41 38-17-4 24-38" fill="#d9e3e5" stroke="#344b56" strokeWidth="4" />
        <path d="M326 270q32 1 49 15-18 15-49 16Z" fill="#8db2c0" stroke="#405560" strokeWidth="3" />
        <path d="M400 284q8-11 19 0m-19 25q8 11 19 0" fill="none" stroke="#708c96" strokeWidth="3" />
        <path d="M354 283v20m-10-10h20" stroke="#c9453d" strokeWidth="5" />
        <g className={onboard || traveling ? "jAnimeAirCabinVisible" : "jAnimeCabinHidden"} clipPath="url(#airAnimeWindow)">
          <path d="M151 258h180v64H151z" fill="url(#airAnimeCabin)" />
          <path d="M164 303h137" stroke="#dce5e2" strokeWidth="4" />
          <rect x="169" y="296" width="89" height="8" rx="3" fill="#dfe5e2" />
          <circle cx="180" cy="284" r="8" fill="#e0ae88" />
          <path d="M190 279h49l18 17h-67Z" fill="#f2f0e8" />
          <path d="M219 282h29l10 14h-39Z" fill="#b84743" />
          <path d="M231 283v12m-5-6h11" stroke="#fff" strokeWidth="2" />
          <path d="M267 268v18m-7-18h14m-7 18v18" stroke="#e2bd62" strokeWidth="2.5" />
          <path d="M260 270h14v14h-14z" fill="#9db8b7" stroke="#edf2ed" strokeWidth="2" />
          <rect x="294" y="276" width="24" height="23" fill="#243f48" stroke="#c9d9d5" strokeWidth="2" />
          <path d="M297 289q4-10 8 0t8 0" fill="none" stroke="#4ab79d" strokeWidth="2" />
          <circle cx="282" cy="280" r="8" fill="#dda784" />
          <path d="M273 290q10-7 19 1l6 16h-31Z" fill="#39788a" />
        </g>
        <path d="M157 266h-4v44h4m166-44h4v44h-4" fill="none" stroke="#a9b6ba" strokeWidth="4" />
        <path d="M80 332h140m-124 0-16 10m140-10 16 10" stroke="#263c48" strokeWidth="4" strokeLinecap="round" />
      </g>
      {(phase <= 2 || transferring) && <AnimeStretcher x={patientX} running={loading || transferring} />}
      {onboard && <g className="jAnimeInteriorPanel">
        <rect x="155" y="77" width="890" height="286" rx="10" fill="#142b35" stroke="#d9e3e0" strokeWidth="5" />
        <text x="190" y="124" fill="#f2c977" fontSize="16" fontWeight="700" letterSpacing="3">AIR AMBULANCE · IN-FLIGHT CRITICAL CARE</text>
        <path d="M230 310h520v15H230zM265 325v24m445-24v24" stroke="#dce5e2" strokeWidth="6" strokeLinecap="round" />
        <rect x="245" y="279" width="480" height="27" rx="10" fill="#d8e0dd" />
        <circle cx="310" cy="246" r="23" fill="#e0b18f" />
        <path d="M334 230q120-26 258 20l30 29H330Z" fill="#f0f0e9" stroke="#819398" strokeWidth="4" />
        <path d="M540 240h78l33 39h-112Z" fill="#b84743" />
        <path d="M584 243v31m-11-15h22" stroke="#fff" strokeWidth="5" />
        <path d="M750 269v-99m0 9q0-18 18-18h20" stroke="#dce5e2" strokeWidth="4" />
        <path d="M790 159h57v79h-57z" fill="#abc2bd" stroke="#edf2ed" strokeWidth="4" />
        <path d="M799 211q10-34 19 0t18 0t12 0" fill="none" stroke="#358d7e" strokeWidth="4" />
        <circle cx="907" cy="218" r="24" fill="#dda784" />
        <path d="M878 247q29-20 58 1l28 61H851Z" fill="#39788a" stroke="#203b46" strokeWidth="4" />
        <path d="m887 264-54 24m107-17 33 31" fill="none" stroke="#dda784" strokeWidth="12" strokeLinecap="round" />
      </g>}
    </svg>
  );
}

function TrainAnimeScene({ phase, phaseProgress, travelProgress }) {
  const loading = phase === 2;
  const onboard = phase === 3;
  const traveling = phase === 4;
  const arrival = phase >= 5;
  const transferring = phase === 6;
  const trainX = phase === 0 ? -650
    : phase === 1 ? -650 + phaseProgress * 760
      : traveling ? 110 + travelProgress * 500
        : arrival ? 610 : 110;
  const patientX = loading ? 120 + phaseProgress * 280 : transferring ? 650 + phaseProgress * 215 : 130;

  return (
    <svg className={`jRoadAnimeScene jTrainAnimeScene${traveling ? " jAnimeTrainTravel" : ""}`} viewBox="0 0 1200 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Animated train ambulance carrying a critical patient to the destination station">
      <defs>
        <linearGradient id="trainAnimeSky" x2="0" y2="1"><stop stopColor="#344d61" /><stop offset=".7" stopColor="#a7b7b1" /><stop offset="1" stopColor="#d4c39e" /></linearGradient>
        <linearGradient id="trainAnimeBody" x2="0" y2="1"><stop stopColor="#fff" /><stop offset="1" stopColor="#d9e2e3" /></linearGradient>
        <clipPath id="trainAnimeWindow"><path d="M254 255h180v56H254z" /></clipPath>
      </defs>
      <rect width="1200" height="520" fill="url(#trainAnimeSky)" />
      <g className={traveling ? "jAnimeParallax" : ""} fill="#53645f" opacity=".76">
        <path d="M0 260h90v-89h58v89h63v-124h72v124h76v-95h54v95h72v-135h75v135h65v-83h81v83h84v-111h64v111h94v-143h75v143h78v112H0Z" />
      </g>
      <g className="jAnimeDestinationStation" opacity={arrival ? 1 : .08}>
        <path d="M900 194h270v151H900z" fill="#d9ded9" stroke="#f6f3e9" strokeWidth="5" />
        <path d="M876 194h318v-18H876z" fill="#ad7547" />
        <path d="M931 226h60v56h-60zm100 0h60v56h-60z" fill="#7da3ad" />
        <path d="M1011 194v-52m-26 26h52" stroke="#bd3d3d" strokeWidth="9" />
        <text x="925" y="325" fill="#30434b" fontSize="16" fontWeight="800" letterSpacing="2">DESTINATION STATION</text>
      </g>
      <path d="M0 360h1200v160H0Z" fill="#59645c" />
      <path d="M0 416h1200v104H0Z" fill="#303638" />
      <g className={traveling ? "jAnimeSleepers jAnimeSleepersMoving" : "jAnimeSleepers"}>
        <path d="M0 433h1200m0 45H0" stroke="#a0a5a0" strokeWidth="7" />
        <path d="M0 416v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80m42-80v80" stroke="#715a43" strokeWidth="12" />
      </g>
      <g className="jAnimeTrain" transform={`translate(${trainX} 0)`}>
        <ellipse cx="300" cy="400" rx="335" ry="13" fill="#111a20" opacity=".45" />
        <path d="M0 286q0-69 67-82h426q67 0 83 55v119H0Z" fill="url(#trainAnimeBody)" stroke="#34444b" strokeWidth="5" />
        <path d="M9 334h555v26H9z" fill="#d66b45" />
        <path d="M14 365h547v9H14z" fill="#526e7b" />
        <path d="M20 273q10-47 54-50h362v63H20z" fill="#41616d" stroke="#263941" strokeWidth="4" />
        <path d="M57 237v45m71-59v59m71-59v59m71-59v59m71-59v59m71-59v59" stroke="#aec3c7" strokeWidth="4" />
        <path d="M20 279h415" stroke="#fff" strokeWidth="4" />
        <path d="M17 365h20v12H17zm515 0h26v12h-26z" fill="#f2dca4" />
        <g className={onboard || traveling ? "jAnimeTrainCabinVisible" : "jAnimeCabinHidden"} clipPath="url(#trainAnimeWindow)">
          <path d="M250 249h188v68H250z" fill="#274650" />
          <path d="M263 301h151" stroke="#dce5e2" strokeWidth="4" />
          <circle cx="281" cy="282" r="9" fill="#e0ae88" />
          <path d="M293 274h76l20 27h-100Z" fill="#f0efe9" />
          <path d="M384 255v20m-8-20h16m-8 20v25" stroke="#e3c268" strokeWidth="3" />
          <rect x="404" y="272" width="23" height="28" fill="#91aaa9" />
          <path d="M406 288q5-12 10 0t8 0" fill="none" stroke="#358d7e" strokeWidth="2" />
        </g>
        <path d="M249 252h-5v58h5m190-58h5v58h-5" fill="none" stroke="#aab9bb" strokeWidth="4" />
        <path d="M67 378v15m84-15v15m84-15v15m84-15v15m84-15v15m84-15v15" stroke="#26363d" strokeWidth="9" />
        <path d="M470 288v18m-9-9h18" stroke="#c9453d" strokeWidth="5" />
      </g>
      {(phase <= 2 || transferring) && <AnimeStretcher x={patientX} running={loading || transferring} />}
      {onboard && <g className="jAnimeInteriorPanel">
        <rect x="155" y="77" width="890" height="286" rx="10" fill="#142b35" stroke="#d9e3e0" strokeWidth="5" />
        <text x="190" y="124" fill="#f2c977" fontSize="16" fontWeight="700" letterSpacing="3">TRAIN · MEDICAL-CARE COMPARTMENT</text>
        <path d="M230 310h520v15H230zM265 325v24m445-24v24" stroke="#dce5e2" strokeWidth="6" strokeLinecap="round" />
        <rect x="245" y="279" width="480" height="27" rx="10" fill="#d8e0dd" />
        <circle cx="310" cy="246" r="23" fill="#e0b18f" />
        <path d="M334 230q120-26 258 20l30 29H330Z" fill="#f0f0e9" stroke="#819398" strokeWidth="4" />
        <path d="M540 240h78l33 39h-112Z" fill="#b84743" />
        <path d="M584 243v31m-11-15h22" stroke="#fff" strokeWidth="5" />
        <path d="M750 269v-99m0 9q0-18 18-18h20" stroke="#dce5e2" strokeWidth="4" />
        <path d="M790 159h57v79h-57z" fill="#abc2bd" stroke="#edf2ed" strokeWidth="4" />
        <path d="M799 211q10-34 19 0t18 0t12 0" fill="none" stroke="#358d7e" strokeWidth="4" />
        <circle cx="907" cy="218" r="24" fill="#dda784" />
        <path d="M878 247q29-20 58 1l28 61H851Z" fill="#39788a" stroke="#203b46" strokeWidth="4" />
        <path d="m887 264-54 24m107-17 33 31" fill="none" stroke="#dda784" strokeWidth="12" strokeLinecap="round" />
      </g>}
    </svg>
  );
}

function CinematicJourney({ kind, preview = false }) {
  const story = STORIES[kind];
  const { phase, phaseProgress, travelProgress, progress, done, replay } = useCinematicJourney({ loop: preview });
  const caption = done ? "PATIENT SUCCESSFULLY TRANSPORTED · JOURNEY COMPLETED" : story.messages[Math.min(phase, 6)];

  return (
    <section className={`jWrap jWrap-${kind}${preview ? " jWrapPreview" : ""}`} aria-label={`${story.title} cinematic journey`}>
      {!preview && <header className="jHead">
        <h2 className="jTitle">{story.title}</h2>
        <p className="jSub">Critical care transport · from pickup to destination</p>
      </header>}

      <div className={`jStage jStage-${story.setting} jPhase-${Math.min(phase, 6)}${kind === "road" && phase <= 2 ? " jRoadUrgent" : ""}${done ? " jStageDone" : ""}`}>
        {kind === "road" && <RoadAnimeScene phase={phase} phaseProgress={phaseProgress} travelProgress={travelProgress} />}
        {kind === "air" && <AirAnimeScene phase={phase} phaseProgress={phaseProgress} travelProgress={travelProgress} />}
        {kind === "train" && <TrainAnimeScene phase={phase} phaseProgress={phaseProgress} travelProgress={travelProgress} />}
        {!preview && <div className="jCaption" aria-live="polite">{caption}</div>}
        {!preview && done && <div className="jCompletion" role="status"><strong>Patient Successfully Transported</strong><span>Journey Completed</span></div>}
      </div>

      {!preview && <div className="jPlayback">
        <div className="jProgressTrack" role="progressbar" aria-label="Journey playback" aria-valuemin="0" aria-valuemax="100" aria-valuenow={Math.round(progress)}>
          <div className="jProgressFill" style={{ width: `${progress}%` }} />
        </div>
        {done && <button className="jReplay" onClick={replay}>Replay Journey</button>}
      </div>}
    </section>
  );
}

export function RoadJourney() {
  return <CinematicJourney kind="road" />;
}

export function AirJourney() {
  return <CinematicJourney kind="air" />;
}

export function TrainJourney() {
  return <CinematicJourney kind="train" />;
}

export function JourneyPreview({ serviceKey }) {
  if (!STORIES[serviceKey]) return null;
  return <CinematicJourney kind={serviceKey} preview />;
}

export default function JourneyAnimation({ serviceKey }) {
  if (!STORIES[serviceKey]) return null;
  return <CinematicJourney kind={serviceKey} />;
}
