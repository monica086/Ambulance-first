import { useState, useEffect, useRef } from "react";
import "./RealisticServicePreview.css";

/* ── inject keyframes once into the document head ─────── */
if (typeof document !== "undefined" && !document.getElementById("rsp-kf")) {
  const s = document.createElement("style");
  s.id = "rsp-kf";
  s.textContent = `
    @keyframes rsp-kb-zi  { from{transform:scale(1.00)} to{transform:scale(1.09)} }
    @keyframes rsp-kb-zo  { from{transform:scale(1.09)} to{transform:scale(1.00)} }
    @keyframes rsp-kb-pr  { from{transform:scale(1.06) translateX(-2%)} to{transform:scale(1.06) translateX(2%)} }
    @keyframes rsp-kb-pl  { from{transform:scale(1.06) translateX(2%)}  to{transform:scale(1.06) translateX(-2%)} }
    @keyframes rsp-fade-in  { from{opacity:0} to{opacity:1} }
    @keyframes rsp-fade-out { from{opacity:1} to{opacity:0} }
  `;
  document.head.appendChild(s);
}

/* ── verified asset lists per service ────────────────── */
const PREVIEWS = {
  road: [
    "/medical-journey/patient-stretcher.jpg",
    "/medical-journey/patient-loading.jpg",
    "/medical-journey/ambulance-interior.jpg",
    "/medical-journey/ambulance-in-transit.jpg",
    "/medical-journey/hospital-arrival.jpg",
    "/medical-journey/patient-transfer.jpg",
  ],
  air: [
    "/medical-journey/air-patient-transfer.jpg",
    "/medical-journey/air-patient-loading.jpg",
    "/medical-journey/air-ambulance-interior.jpg",
    "/assets/services/air-ambulance.jpg",
    "/medical-journey/air-hospital-arrival.jpg",
    "/medical-journey/air-patient-transfer.jpg",
  ],
  train: [
    "/medical-journey/train-patient-stretcher.jpg",
    "/medical-journey/train-patient-loading.jpg",
    "/medical-journey/train-patient-care-latest.webp",
    "/assets/services/vande-bharat.jpg",
    "/medical-journey/train-arrival.jpg",
    "/medical-journey/train-patient-care-latest.webp",
  ],
};

/* Ken Burns variant per slide index */
const KB_ANIM = [
  "rsp-kb-zi 3.4s ease-out forwards",
  "rsp-kb-pr 3.4s ease-out forwards",
  "rsp-kb-zo 3.4s ease-out forwards",
  "rsp-kb-pl 3.4s ease-out forwards",
];

const SLIDE_MS = 2800;
const PHASE_LABELS = {
  road: ["Patient on Stretcher", "Loading", "Onboard Care", "Road Transit", "Hospital Arrival", "Patient Transfer"],
  air: ["Patient on Stretcher", "Air Loading", "Air Medical Care", "Air Ambulance In Flight", "Helipad Arrival", "Patient Transfer"],
  train: ["Patient on Stretcher", "Train Boarding", "Train Medical Care", "Train In Transit", "Station Arrival", "Patient Transfer"],
};

/* shared img style factory */
function imgStyle(kbAnim, fadeAnim, z) {
  return {
    position : "absolute",
    inset    : 0,
    width    : "100%",
    height   : "100%",
    objectFit: "cover",
    animation: `${kbAnim}, ${fadeAnim} 0.65s ease forwards`,
    zIndex   : z,
  };
}

export default function RealisticServicePreview({ serviceKey, photos: customPhotos }) {
  /* hooks must always run — guard with fallback array */
  const photos = customPhotos || PREVIEWS[serviceKey] || [];

  const [cur,    setCur]    = useState(0);
  const [prev,   setPrev]   = useState(null);
  const [fading, setFading] = useState(false);
  const timerRef            = useRef(null);
  const fadeTimerRef        = useRef(null);

  useEffect(() => {
    if (photos.length === 0) return;
    timerRef.current = setInterval(() => {
      setCur(c => {
        const next = (c + 1) % photos.length;
        setPrev(c);
        setFading(true);
        clearTimeout(fadeTimerRef.current);
        fadeTimerRef.current = setTimeout(() => {
          setPrev(null);
          setFading(false);
        }, 700);
        return next;
      });
    }, SLIDE_MS);
    return () => {
      clearInterval(timerRef.current);
      clearTimeout(fadeTimerRef.current);
    };
  }, [photos]);

  if (photos.length === 0) return null;

  const phaseLabels = PHASE_LABELS[serviceKey] || PHASE_LABELS.road;

  const renderSlide = (index, fadeAnim, z, key) => {
    const src = photos[index];
    const style = {
      position: "absolute",
      inset: 0,
      zIndex: z,
      animation: `${fadeAnim} 0.65s ease forwards`,
    };

    if (!src) {
      return (
        <div className="rspMissingStage" key={key} style={style}>
          <span className="rspMissingEyebrow">SERVICE-SPECIFIC PHOTO NEEDED</span>
          <strong>{phaseLabels[index % phaseLabels.length]}</strong>
          <span>This stage is awaiting a verified {serviceKey} transport image.</span>
        </div>
      );
    }

    return (
      <img
        key={key}
        src={src}
        alt=""
        style={{
          ...imgStyle(KB_ANIM[index % KB_ANIM.length], fadeAnim, z),
          animation: `${KB_ANIM[index % KB_ANIM.length]}, ${fadeAnim} 0.65s ease forwards`,
        }}
      />
    );
  };

  return (
    <div className={`rspPreview${customPhotos ? " rspPreviewJourney" : ""}`} style={{ position: "absolute", inset: 0, overflow: "hidden", background: "#111" }}>

      {/* outgoing photo — fades out */}
      {fading && prev !== null && (
        renderSlide(prev, "rsp-fade-out", 1, `out-${prev}`)
      )}

      {/* incoming photo — fades in with Ken Burns */}
      {renderSlide(cur, "rsp-fade-in", 2, `in-${cur}`)}

      {/* vignette */}
      <div style={{
        position      : "absolute",
        inset         : 0,
        background    : "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,.48) 100%)",
        zIndex        : 3,
        pointerEvents : "none",
      }} />

      {customPhotos && (
        <div className="rspJourneyIndicator" aria-live="polite">
          <span className="rspJourneyPhase">
            {String(cur + 1).padStart(2, "0")} {phaseLabels[cur % phaseLabels.length]}
          </span>
          <div className="rspJourneyProgress" aria-label={`Phase ${cur + 1} of ${photos.length}`}>
            {photos.map((_, index) => (
              <span
                className={index === cur ? "rspJourneyProgressActive" : index < cur ? "rspJourneyProgressDone" : ""}
                key={index}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
