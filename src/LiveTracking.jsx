import { useEffect, useRef, useState, useCallback } from "react";

/* ── Mock data ───────────────────────────────────────── */
const MOCK = {
  id: "AMB-1042",
  priority: "EMERGENCY",
  team: "Assigned",
  pickup: "Jubilee Hills, Hyderabad",
  destination: "Apollo Hospitals, Jubilee Hills",
};

/* Route waypoints as % of SVG viewBox (0–100) */
const ROUTE = [
  { x: 14, y: 72 },
  { x: 22, y: 65 },
  { x: 31, y: 58 },
  { x: 40, y: 52 },
  { x: 50, y: 48 },
  { x: 60, y: 44 },
  { x: 70, y: 40 },
  { x: 79, y: 36 },
  { x: 86, y: 30 },
];

const TOTAL_DIST = 3.2; // km
const TOTAL_ETA  = 8;   // min

function lerp(a, b, t) { return a + (b - a) * t; }

function pointOnRoute(t) {
  const segments = ROUTE.length - 1;
  const seg = Math.min(Math.floor(t * segments), segments - 1);
  const segT = t * segments - seg;
  return {
    x: lerp(ROUTE[seg].x, ROUTE[seg + 1].x, segT),
    y: lerp(ROUTE[seg].y, ROUTE[seg + 1].y, segT),
  };
}

/* Build SVG polyline points string */
const routePoints = ROUTE.map((p) => `${p.x},${p.y}`).join(" ");

/* ── Map background grid lines ───────────────────────── */
const GRID_H = [20, 35, 50, 65, 80];
const GRID_V = [15, 30, 45, 60, 75, 90];

/* ── Road paths (decorative) ─────────────────────────── */
const ROADS = [
  "M0,72 L100,72",
  "M0,50 L100,50",
  "M0,30 L100,30",
  "M14,0 L14,100",
  "M40,0 L40,100",
  "M70,0 L70,100",
  "M86,0 L86,100",
];

export default function LiveTracking() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning]   = useState(true);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const DURATION = 28000; // 28 s full loop

  const tick = useCallback((now) => {
    if (!startRef.current) startRef.current = now;
    const elapsed = (now - startRef.current) % DURATION;
    setProgress(elapsed / DURATION);
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (running) {
      rafRef.current = requestAnimationFrame(tick);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [running, tick]);

  const pos = pointOnRoute(progress);
  const eta  = Math.max(1, Math.round(TOTAL_ETA * (1 - progress)));
  const dist = Math.max(0.1, +(TOTAL_DIST * (1 - progress)).toFixed(1));
  const pct  = Math.round(progress * 100);

  /* Completed route up to current position */
  const completedPoints = [];
  const segments = ROUTE.length - 1;
  const curSeg = Math.min(Math.floor(progress * segments), segments - 1);
  for (let i = 0; i <= curSeg; i++) completedPoints.push(`${ROUTE[i].x},${ROUTE[i].y}`);
  completedPoints.push(`${pos.x},${pos.y}`);

  const statusLabel = progress < 0.15 ? "Dispatched"
    : progress < 0.85 ? "En Route"
    : "Arriving";

  return (
    <section className="ltSection reveal">
      <div className="ltHeader">
        <div className="ltHeaderLeft">
          <span className="ltLiveDot" />
          <div>
            <p className="ltSectionLabel">LIVE AMBULANCE TRACKING</p>
            <h2 className="ltTitle">Real-Time Dispatch Coordination</h2>
          </div>
        </div>
        <p className="ltDisclaimer">
          Demo simulation — mock data only. Not connected to live GPS.
        </p>
      </div>

      <div className="ltBody">
        {/* ── MAP ── */}
        <div className="ltMapWrap">
          <svg
            className="ltMap"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
            aria-label="Ambulance route map"
          >
            {/* Map background */}
            <rect width="100" height="100" fill="#f0eded" />

            {/* Grid */}
            {GRID_H.map((y) => (
              <line key={`h${y}`} x1="0" y1={y} x2="100" y2={y} stroke="#ddd8d8" strokeWidth="0.3" />
            ))}
            {GRID_V.map((x) => (
              <line key={`v${x}`} x1={x} y1="0" x2={x} y2="100" stroke="#ddd8d8" strokeWidth="0.3" />
            ))}

            {/* Road network */}
            {ROADS.map((d, i) => (
              <path key={i} d={d} stroke="#d4c8c8" strokeWidth="1.2" fill="none" />
            ))}

            {/* City blocks */}
            <rect x="16" y="20" width="12" height="8" rx="0.5" fill="#ddd0d0" opacity="0.7" />
            <rect x="32" y="15" width="6" height="12" rx="0.5" fill="#ddd0d0" opacity="0.7" />
            <rect x="42" y="22" width="10" height="6" rx="0.5" fill="#ddd0d0" opacity="0.7" />
            <rect x="55" y="18" width="12" height="9" rx="0.5" fill="#ddd0d0" opacity="0.7" />
            <rect x="72" y="12" width="8" height="14" rx="0.5" fill="#ddd0d0" opacity="0.7" />
            <rect x="16" y="55" width="20" height="12" rx="0.5" fill="#ddd0d0" opacity="0.7" />
            <rect x="42" y="58" width="14" height="8" rx="0.5" fill="#ddd0d0" opacity="0.7" />

            {/* Full route (grey) */}
            <polyline
              points={routePoints}
              fill="none"
              stroke="#b0bfb8"
              strokeWidth="1.4"
              strokeDasharray="2 1.5"
            />

            {/* Completed route (red) */}
            {completedPoints.length > 1 && (
              <polyline
                points={completedPoints.join(" ")}
                fill="none"
                stroke="#D9362B"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Pickup marker */}
            <g transform={`translate(${ROUTE[0].x},${ROUTE[0].y})`}>
              <circle r="3.5" fill="#d94f3d" opacity="0.25" className="ltPulseRing" />
              <circle r="2" fill="#d94f3d" />
              <text x="3.5" y="-3" fontSize="3" fill="#d94f3d" fontWeight="700">Pickup</text>
            </g>

            {/* Hospital marker */}
            <g transform={`translate(${ROUTE[ROUTE.length - 1].x},${ROUTE[ROUTE.length - 1].y})`}>
              <circle r="4" fill="#A8201A" opacity="0.2" />
              <circle r="2.2" fill="#A8201A" />
              <text x="-12" y="-3.5" fontSize="2.8" fill="#A8201A" fontWeight="700">Apollo Hospital</text>
              <text x="3" y="0.8" fontSize="3.5" fill="#fff" fontWeight="900" textAnchor="middle" dominantBaseline="middle">+</text>
            </g>

            {/* Ambulance marker */}
            <g transform={`translate(${pos.x},${pos.y})`} className="ltAmbMarker">
              {/* Pulse rings */}
              <circle r="5" fill="#d94f3d" opacity="0.12" className="ltPulse1" />
              <circle r="3.5" fill="#d94f3d" opacity="0.18" className="ltPulse2" />
              {/* Ambulance icon */}
              <circle r="2.4" fill="#d94f3d" />
              <text
                x="0" y="0.9"
                fontSize="2.6"
                fill="#fff"
                fontWeight="900"
                textAnchor="middle"
                dominantBaseline="middle"
              >
                🚑
              </text>
            </g>
          </svg>

          {/* Map overlay labels */}
          <div className="ltMapLabel ltMapLabelPickup">
            <span className="ltMapDotRed" />
            Pickup
          </div>
          <div className="ltMapLabel ltMapLabelHospital">
            <span className="ltMapDotRed" />
            Apollo Hospital
          </div>
        </div>

        {/* ── TRACKING PANEL ── */}
        <div className="ltPanel">
          {/* Status header */}
          <div className="ltPanelStatus">
            <div className="ltStatusBadge">
              <span className="ltStatusDot" />
              {statusLabel}
            </div>
            <span className="ltPriority">🔴 {MOCK.priority}</span>
          </div>

          {/* Ambulance ID */}
          <div className="ltAmbId">
            <span className="ltAmbIdLabel">AMBULANCE ID</span>
            <span className="ltAmbIdValue">{MOCK.id}</span>
          </div>

          {/* ETA + Distance */}
          <div className="ltMetrics">
            <div className="ltMetric">
              <span className="ltMetricValue">{eta}</span>
              <span className="ltMetricUnit">min</span>
              <span className="ltMetricLabel">ETA</span>
            </div>
            <div className="ltMetricDivider" />
            <div className="ltMetric">
              <span className="ltMetricValue">{dist}</span>
              <span className="ltMetricUnit">km</span>
              <span className="ltMetricLabel">Remaining</span>
            </div>
            <div className="ltMetricDivider" />
            <div className="ltMetric">
              <span className="ltMetricValue">{pct}</span>
              <span className="ltMetricUnit">%</span>
              <span className="ltMetricLabel">Complete</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="ltProgressWrap">
            <div className="ltProgressBar" style={{ width: `${pct}%` }} />
          </div>

          {/* Route info */}
          <div className="ltRouteInfo">
            <div className="ltRouteRow">
              <span className="ltRouteDot ltRouteDotRed" />
              <div>
                <span className="ltRouteLabel">PICKUP</span>
                <span className="ltRouteValue">{MOCK.pickup}</span>
              </div>
            </div>
            <div className="ltRouteLine" />
            <div className="ltRouteRow">
              <span className="ltRouteDot ltRouteDotGreen" />
              <div>
                <span className="ltRouteLabel">DESTINATION</span>
                <span className="ltRouteValue">{MOCK.destination}</span>
              </div>
            </div>
          </div>

          {/* Info rows */}
          <div className="ltInfoRows">
            <div className="ltInfoRow">
              <span className="ltInfoLabel">Medical Team</span>
              <span className="ltInfoValue ltInfoGreen">✓ {MOCK.team}</span>
            </div>
            <div className="ltInfoRow">
              <span className="ltInfoLabel">Priority</span>
              <span className="ltInfoValue ltInfoRed">{MOCK.priority}</span>
            </div>
            <div className="ltInfoRow">
              <span className="ltInfoLabel">Coordination</span>
              <span className="ltInfoValue ltInfoGreen">✓ Active</span>
            </div>
          </div>

          {/* Pause/resume */}
          <button
            className="ltToggleBtn"
            onClick={() => {
              if (!running) startRef.current = null;
              setRunning((r) => !r);
            }}
          >
            {running ? "⏸ Pause Simulation" : "▶ Resume Simulation"}
          </button>

          <p className="ltNote">
            This is a demonstration simulation using mock data only.
            Not connected to live GPS or real dispatch systems.
          </p>
        </div>
      </div>
    </section>
  );
}
