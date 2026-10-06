import { useEffect, useRef, useState } from "react";

const VIDEO_META = {
  road: {
    src: "/videos/road-ambulance.mp4",
    title: "Road Ambulance Journey",
    description:
      "Patient on stretcher → loaded into ambulance → patient inside → ambulance travels → hospital arrival → patient transfer.",
    poster: "/assets/services/road-ambulance.jpg",
  },
  air: {
    src: "/videos/air-ambulance.mp4",
    title: "Air Ambulance Journey",
    description:
      "Patient on stretcher → loaded into medical aircraft → in-flight care → aircraft travels → destination hospital → patient transfer.",
    poster: "/assets/services/air-ambulance.jpg",
  },
  train: {
    src: "/videos/train-ambulance.mp4",
    title: "Train Ambulance Journey — Vande Bharat Express",
    description:
      "Patient on stretcher → boards Vande Bharat → dedicated medical-care compartment → medical care → train travels → destination arrival → patient transfer.",
    poster: "/assets/services/vande-bharat.jpg",
  },
};

export default function ServiceVideo({ serviceKey }) {
  const meta = VIDEO_META[serviceKey];
  const videoRef = useRef(null);
  const [playing, setPlaying]     = useState(false);
  const [ready, setReady]         = useState(false);
  const [missing, setMissing]     = useState(false);
  const [progress, setProgress]   = useState(0);
  const [duration, setDuration]   = useState(0);
  const [showPlay, setShowPlay]   = useState(true);

  if (!meta) return null;

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) { v.play(); setPlaying(true); setShowPlay(false); }
    else          { v.pause(); setPlaying(false); setShowPlay(true); }
  };

  const replay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setPlaying(true);
    setShowPlay(false);
    setProgress(0);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setProgress((v.currentTime / v.duration) * 100);
  };

  const handleEnded = () => {
    setPlaying(false);
    setShowPlay(true);
  };

  const handleCanPlay = () => {
    setReady(true);
    setMissing(false);
    const v = videoRef.current;
    if (v) {
      setDuration(v.duration);
      v.play().then(() => { setPlaying(true); setShowPlay(false); }).catch(() => {
        setPlaying(false);
        setShowPlay(true);
      });
    }
  };

  const handleError = () => {
    setMissing(true);
    setReady(false);
  };

  const seek = (e) => {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    v.currentTime = pct * v.duration;
  };

  const fmt = (s) => {
    if (!s || isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const currentTime = videoRef.current ? videoRef.current.currentTime : 0;

  return (
    <div className="svWrap">
      <div className="svHeader">
        <p className="svLabel">SERVICE JOURNEY VIDEO</p>
        <h2 className="svTitle">{meta.title}</h2>
        <p className="svDesc">{meta.description}</p>
      </div>

      <div className="svPlayer">
        {/* Video element */}
        <video
          ref={videoRef}
          className="svVideo"
          src={meta.src}
          poster={meta.poster}
          muted
          playsInline
          preload="metadata"
          onCanPlay={handleCanPlay}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
          onError={handleError}
          aria-label={meta.title}
        />

        {/* Missing file fallback */}
        {missing && (
          <div className="svFallback">
            <div className="svFallbackInner">
              <div className="svFallbackIcon">🎬</div>
              <h3>Video Coming Soon</h3>
              <p>
                Place your generated MP4 at:
                <br />
                <code>{meta.src}</code>
              </p>
              <p className="svFallbackNote">
                Generate using Kling AI, Runway Gen-3, Sora, or Veo and place
                the file in <code>public/videos/</code>.
              </p>
            </div>
          </div>
        )}

        {/* Play button overlay */}
        {!missing && showPlay && (
          <button className="svPlayOverlay" onClick={toggle} aria-label="Play video">
            <span className="svPlayIcon">▶</span>
          </button>
        )}

        {/* Controls bar */}
        {!missing && (
          <div className="svControls">
            <button className="svCtrlBtn" onClick={toggle} aria-label={playing ? "Pause" : "Play"}>
              {playing ? "⏸" : "▶"}
            </button>
            <button className="svCtrlBtn" onClick={replay} aria-label="Replay">
              ↺
            </button>
            <div className="svSeekBar" onClick={seek} role="slider" aria-label="Seek" aria-valuenow={Math.round(progress)}>
              <div className="svSeekFill" style={{ width: `${progress}%` }} />
              <div className="svSeekThumb" style={{ left: `${progress}%` }} />
            </div>
            <span className="svTime">
              {fmt(currentTime)} / {fmt(duration)}
            </span>
          </div>
        )}
      </div>

      <p className="svNote">
        ✚ This video demonstrates the complete patient transportation journey
        from pickup to hospital arrival.
      </p>
    </div>
  );
}
