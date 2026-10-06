import { existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const framesRoot = join(projectRoot, "public", "medical-journey-frames");
const videosRoot = join(projectRoot, "public", "videos");

const journeys = {
  road: {
    output: "road-ambulance-journey.mp4",
    frames: [
      "01-patient-on-stretcher.jpg",
      "02-loading-into-road-ambulance.jpg",
      "03-inside-road-ambulance-medical-care.jpg",
      "04-road-ambulance-in-transit.jpg",
      "05-hospital-arrival.jpg",
      "06-patient-transfer-handover.jpg",
    ],
  },
  air: {
    output: "air-ambulance-journey.mp4",
    frames: [
      "01-patient-on-stretcher.jpg",
      "02-loading-into-air-ambulance.jpg",
      "03-inside-air-ambulance-medical-care.jpg",
      "04-air-ambulance-in-flight.jpg",
      "05-air-ambulance-arrival.jpg",
      "06-patient-transfer-handover.jpg",
    ],
  },
  train: {
    output: "train-ambulance-journey.mp4",
    frames: [
      "01-patient-on-stretcher.jpg",
      "02-boarding-train.jpg",
      "03-inside-train-medical-care.jpg",
      "04-vande-bharat-in-transit.jpg",
      "05-destination-arrival.jpg",
      "06-patient-transfer-handover.jpg",
    ],
  },
};

const stageDuration = 4.8;
const crossfadeDuration = 0.8;
const fps = 30;
const ffmpegCandidates = [
  process.env.FFMPEG_PATH,
  "ffmpeg",
  process.env.LOCALAPPDATA
    ? join(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Links", "ffmpeg.exe")
    : null,
  process.env.ProgramFiles
    ? join(process.env.ProgramFiles, "FFmpeg", "bin", "ffmpeg.exe")
    : null,
].filter(Boolean);

function runFfmpeg(args) {
  for (const executable of ffmpegCandidates) {
    const result = spawnSync(executable, args, {
      cwd: projectRoot,
      stdio: "inherit",
      windowsHide: true,
    });
    if (!result.error) {
      if (result.status !== 0) {
        throw new Error(`FFmpeg failed with exit code ${result.status}.`);
      }
      return;
    }
    if (result.error.code !== "ENOENT") throw result.error;
  }
  throw new Error("FFmpeg was not found. Set FFMPEG_PATH or add ffmpeg to PATH.");
}

for (const [journey, config] of Object.entries(journeys)) {
  const sources = config.frames.map((frame) => join(framesRoot, journey, frame));
  const missing = sources.filter((source) => !existsSync(source));
  if (missing.length) {
    throw new Error(`Missing ${journey} source frame(s):\n${missing.join("\n")}`);
  }

  mkdirSync(videosRoot, { recursive: true });
  const filters = [];
  sources.forEach((_, index) => {
    filters.push(
      `[${index}:v]scale=1920:1080:force_original_aspect_ratio=increase,` +
        `crop=1920:1080,zoompan=` +
        `z='min(zoom+0.00025,1.06)':` +
        `x='iw/2-(iw/zoom/2)+sin(on/45)*12':` +
        `y='ih/2-(ih/zoom/2)+cos(on/55)*7':` +
        `d=1:s=1920x1080:fps=${fps},setsar=1,` +
        `format=yuv420p,settb=AVTB,setpts=PTS-STARTPTS[v${index}]`,
    );
  });

  let previous = "v0";
  for (let index = 1; index < sources.length; index += 1) {
    const output = `xf${index}`;
    const offset = (stageDuration - crossfadeDuration) * index;
    filters.push(
      `[${previous}][v${index}]xfade=transition=fade:` +
        `duration=${crossfadeDuration}:offset=${offset}[${output}]`,
    );
    previous = output;
  }

  const args = [];
  args.push("-y");
  sources.forEach((source) => {
    args.push("-loop", "1", "-framerate", String(fps), "-t", String(stageDuration), "-i", source);
  });
  args.push(
    "-filter_complex",
    filters.join(";"),
    "-map",
    `[${previous}]`,
    "-an",
    "-c:v",
    "libx264",
    "-preset",
    "veryfast",
    "-crf",
    "21",
    "-r",
    String(fps),
    "-pix_fmt",
    "yuv420p",
    "-movflags",
    "+faststart",
    join(videosRoot, config.output),
  );

  console.log(`Creating ${config.output} from ${journey} source frames...`);
  runFfmpeg(args);
}

console.log("Created all three medical journey videos.");
