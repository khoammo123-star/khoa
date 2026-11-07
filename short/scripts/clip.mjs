// usage: node scripts/clip.mjs <out.mp4> <startFrame> <endFrame> [scale] [concurrency]
import path from "node:path";
import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";
const [out, a, b, scale = "0.5", conc = "2"] = process.argv.slice(2);
const browserExecutable = "/opt/pw-browsers/chromium";
const chromiumOptions = { gl: "swangle" };
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts"), publicDir: path.resolve("public") });
const composition = await selectComposition({ serveUrl, id: "BridgeShort", browserExecutable, chromiumOptions });
const t0 = Date.now();
await renderMedia({ composition, serveUrl, codec: "h264", crf: 20, outputLocation: out, frameRange: [Number(a), Number(b)], scale: Number(scale),
  concurrency: Number(conc), browserExecutable, chromiumOptions, timeoutInMilliseconds: 600000,
  onProgress: (p) => { if (p.renderedFrames % 5 === 0) console.log(`frames ${p.renderedFrames}/${Number(b) - Number(a) + 1} @ ${((Date.now() - t0) / 1000).toFixed(0)}s`); } });
console.log("done", ((Date.now() - t0) / 1000).toFixed(0) + "s");
