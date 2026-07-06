#!/usr/bin/env node
// Direct-use CLI for Leonardo AI so we can generate images/videos in this
// Claude Code session before the MCP server is registered with a client.
//
// Usage:
//   LEONARDO_API_KEY=... node scripts/leonardo-cli.mjs image \
//     --prompt "a cozy library at dusk" --width 1024 --height 1024 --num 1
//
//   LEONARDO_API_KEY=... node scripts/leonardo-cli.mjs video \
//     --image-id <generated_images[].id> --motion 5
//
//   LEONARDO_API_KEY=... node scripts/leonardo-cli.mjs models
//   LEONARDO_API_KEY=... node scripts/leonardo-cli.mjs me
//   LEONARDO_API_KEY=... node scripts/leonardo-cli.mjs get <generation_id>
//   LEONARDO_API_KEY=... node scripts/leonardo-cli.mjs download <url> <out.png>

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";

function argFlag(args, name, fallback = undefined) {
  const i = args.indexOf(`--${name}`);
  if (i === -1) return fallback;
  return args[i + 1];
}

function boolFlag(args, name) {
  return args.includes(`--${name}`);
}

const API_KEY = process.env.LEONARDO_API_KEY;
if (!API_KEY) {
  console.error("Missing LEONARDO_API_KEY environment variable.");
  process.exit(2);
}

async function api(pathname, init = {}) {
  const res = await fetch(`${BASE_URL}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });
  const text = await res.text();
  let body;
  try {
    body = text ? JSON.parse(text) : {};
  } catch {
    body = text;
  }
  if (!res.ok) {
    throw new Error(`Leonardo API ${res.status}: ${typeof body === "string" ? body : JSON.stringify(body)}`);
  }
  return body;
}

async function pollGeneration(generationId, {
  intervalMs = 4000,
  timeoutMs = 5 * 60 * 1000,
} = {}) {
  const deadline = Date.now() + timeoutMs;
  let lastStatus = "";
  while (Date.now() < deadline) {
    const resp = await api(`/generations/${generationId}`);
    const g = resp.generations_by_pk;
    if (!g) throw new Error(`Generation ${generationId} not found`);
    if (g.status !== lastStatus) {
      console.error(`[status] ${g.status}`);
      lastStatus = g.status;
    }
    if (g.status === "COMPLETE") return g;
    if (g.status === "FAILED") throw new Error(`Generation ${generationId} FAILED`);
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error(`Timed out waiting for ${generationId}`);
}

async function cmdImage(args) {
  const prompt = argFlag(args, "prompt");
  if (!prompt) throw new Error("--prompt is required");
  const width = parseInt(argFlag(args, "width", "1024"), 10);
  const height = parseInt(argFlag(args, "height", "1024"), 10);
  const num = parseInt(argFlag(args, "num", "1"), 10);
  const modelId = argFlag(args, "model");
  const negative = argFlag(args, "negative");
  const presetStyle = argFlag(args, "style");
  const alchemy = boolFlag(args, "alchemy");
  const photoReal = boolFlag(args, "photo-real");
  const ultra = boolFlag(args, "ultra");
  const enhance = boolFlag(args, "enhance");
  const seed = argFlag(args, "seed");

  const body = {
    prompt,
    num_images: num,
    width,
    height,
    public: false,
  };
  if (modelId) body.modelId = modelId;
  if (negative) body.negative_prompt = negative;
  if (presetStyle) body.presetStyle = presetStyle;
  if (alchemy) body.alchemy = true;
  if (photoReal) body.photoReal = true;
  if (ultra) body.ultra = true;
  if (enhance) body.enhancePrompt = true;
  if (seed) body.seed = parseInt(seed, 10);

  console.error(`[create] POST /generations …`);
  const resp = await api("/generations", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const generationId = resp.sdGenerationJob?.generationId;
  if (!generationId) throw new Error(`No generationId: ${JSON.stringify(resp)}`);
  console.error(`[create] generation_id=${generationId}`);

  const g = await pollGeneration(generationId);
  const images = (g.generated_images ?? []).map((i) => ({
    id: i.id,
    url: i.url,
  }));
  console.log(JSON.stringify({ generation_id: generationId, images }, null, 2));
}

async function cmdVideo(args) {
  const imageId = argFlag(args, "image-id");
  if (!imageId) throw new Error("--image-id is required");
  const motion = parseInt(argFlag(args, "motion", "5"), 10);
  const imageType = argFlag(args, "image-type", "GENERATED");

  const body = {
    imageId,
    motionStrength: motion,
    isPublic: false,
    imageType,
  };
  console.error(`[create] POST /generations-motion-svd …`);
  const resp = await api("/generations-motion-svd", {
    method: "POST",
    body: JSON.stringify(body),
  });
  const generationId = resp.motionSvdGenerationJob?.generationId;
  if (!generationId) throw new Error(`No motion generationId: ${JSON.stringify(resp)}`);
  console.error(`[create] generation_id=${generationId}`);

  const g = await pollGeneration(generationId, { timeoutMs: 8 * 60 * 1000 });
  const videos = (g.generated_images ?? []).map((i) => ({
    id: i.id,
    mp4_url: i.motionMP4URL ?? i.url,
  }));
  console.log(JSON.stringify({ generation_id: generationId, videos }, null, 2));
}

async function cmdGet(args) {
  const id = args[0];
  if (!id) throw new Error("Usage: get <generation_id>");
  const resp = await api(`/generations/${id}`);
  console.log(JSON.stringify(resp, null, 2));
}

async function cmdModels() {
  const resp = await api("/platformModels");
  console.log(JSON.stringify(resp, null, 2));
}

async function cmdMe() {
  const resp = await api("/me");
  console.log(JSON.stringify(resp, null, 2));
}

async function cmdDownload(args) {
  const url = args[0];
  const out = args[1];
  if (!url || !out) throw new Error("Usage: download <url> <out_path>");
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Download ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, buf);
  console.error(`[download] wrote ${out} (${buf.length} bytes)`);
}

const [, , sub, ...rest] = process.argv;

const commands = {
  image: cmdImage,
  video: cmdVideo,
  get: cmdGet,
  models: cmdModels,
  me: cmdMe,
  download: cmdDownload,
};

const fn = commands[sub];
if (!fn) {
  console.error(
    `Unknown command: ${sub}\nUsage: leonardo-cli.mjs <image|video|get|models|me|download> [flags]`,
  );
  process.exit(2);
}

fn(rest).catch((err) => {
  console.error(`[error] ${err.message}`);
  process.exit(1);
});
