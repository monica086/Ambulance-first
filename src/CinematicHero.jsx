import { useEffect, useRef, useState } from "react";

/* ── Hero slides ─────────────────────────────────────── */
const SLIDES = [
  {
    // Slide 1 — Road ambulance on a city street, 3/4 front view with emergency lights
    src: "https://images.unsplash.com/photo-1619025873875-59dfdd2bbbd6?auto=format&fit=crop&w=1600&q=90",
    label: "ROAD AMBULANCE",
    heading: "Emergency Road Ambulance",
    em: "Rapid Response. Safe Arrival.",
    quote: "\u201cEvery second matters when a life is at risk.\u201d",
    sub: "Rapid medical response and safe patient transportation when every second matters.",
  },
  {
    // Slide 2 — Patient stretcher transfer with paramedics
    src: "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=1600&q=90",
    label: "PATIENT TRANSFER",
    heading: "From Emergency Response",
    em: "To Safe Arrival",
    quote: "\u201cFrom emergency response to safe arrival.\u201d",
    sub: "Reliable road, air and train ambulance services — safe, timely and coordinated for every patient and family.",
  },
  {
    // Slide 3 — Medical professionals providing urgent care
    src: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=90",
    label: "MEDICAL CARE",
    heading: "Care That Moves",
    em: "With the Patient",
    quote: "\u201cCare that moves with the patient.\u201d",
    sub: "Reliable road, air and train ambulance services — safe, timely and coordinated for every patient and family.",
  },
  {
    // Slide 4 — Air ambulance / medical helicopter in flight
    src: "https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&w=1600&q=90",
    label: "AIR AMBULANCE",
    heading: "When Distance Matters",
    em: "We Bring Care Closer",
    quote: "\u201cWhen distance matters, we bring care closer.\u201d",
    sub: "Reliable road, air and train ambulance services — safe, timely and coordinated for every patient and family.",
  },
  {
    // Slide 5 — Modern Indian train / Vande Bharat Express
    src: "/assets/services/vande-bharat.jpg",
    label: "TRAIN AMBULANCE",
    heading: "Connecting Patients",
    em: "To the Care They Need",
    quote: "\u201cConnecting patients to the care they need.\u201d",
    sub: "Reliable road, air and train ambulance services — safe, timely and coordinated for every patient and family.",
  },
  {
    // Slide 6 — Hospital arrival and patient handover
    src: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?auto=format&fit=crop&w=1600&q=90",
    label: "HOSPITAL ARRIVAL",
    heading: "The Journey Ends Where",
    em: "Specialised Care Begins",
    quote: "\u201cThe journey ends where specialized care begins.\u201d",
    sub: "Reliable road, air and train ambulance services — safe, timely and coordinated for every patient and family.",
  },
];

const INTERVAL = 5200;

export default function CinematicHero({ go }) {
  const [cur, setCur] = useState(0);
  const [prev, setPrev] = useState(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCur((c) => {
        const next = (c + 1) % SLIDES.length;
        setPrev(c);
        setFading(true);
        setTimeout(() => {
          setCur(next);
          setPrev(null);
          setFading(false);
        }, 900);
        return c;
      });
    }, INTERVAL);
    return () => clearInterval(timerRef.current);
  }, []); // eslint-disable-line

  const slide = SLIDES[cur];

  return (
    <section className="chHero" aria-label="Ambulance First hero">
      {/* Background layers */}
      {prev !== null && (
        <div className="chBg chBgPrev" key={`prev-${prev}`}>
          <img src={SLIDES[prev].src} alt="" aria-hidden="true" />
          <div className="chOverlay" />
        </div>
      )}
      <div className={`chBg chBgCur${fading ? " chBgFadeOut" : ""}`} key={`cur-${cur}`}>
        <img src={slide.src} alt="" aria-hidden="true" className="chBgImg" />
        <div className="chOverlay" />
      </div>

      {/* Content */}
      <div className="chContent" key={cur}>
        <p className="chBadge">
          <span className="chBadgeDot" />
          {slide.label} · 24/7 EMERGENCY MEDICAL TRANSPORTATION
        </p>
        <h1 className="chHeading">
          {slide.heading}
          <br />
          <em>{slide.em}</em>
        </h1>
        <p className="chQuote">{slide.quote}</p>
        <p className="chSub">{slide.sub}</p>
        <div className="chActions">
          <button className="btnPrimary" onClick={() => go("contact")}>
            Book an Ambulance
          </button>
          <button className="btnOutline" onClick={() => go("services")}>
            Explore Services
          </button>
        </div>
        <div className="chTrust">
          <span>✓ 24/7 Available</span>
          <span>✓ Road · Air · Rail</span>
          <span>✓ Trained Medical Teams</span>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="chScrollCue" aria-hidden="true">
        <span />
      </div>
    </section>
  );
}
