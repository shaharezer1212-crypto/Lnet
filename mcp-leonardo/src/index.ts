#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";
import { LeonardoClient } from "./leonardo.js";

const apiKey = process.env.LEONARDO_API_KEY;
if (!apiKey) {
  console.error("[mcp-leonardo] Missing LEONARDO_API_KEY environment variable.");
  process.exit(1);
}

const client = new LeonardoClient({ apiKey });

const GenerateImageSchema = z.object({
  prompt: z.string().min(1),
  model_id: z.string().optional(),
  num_images: z.number().int().min(1).max(8).optional(),
  width: z.number().int().min(32).max(2048).optional(),
  height: z.number().int().min(32).max(2048).optional(),
  negative_prompt: z.string().optional(),
  alchemy: z.boolean().optional(),
  photo_real: z.boolean().optional(),
  photo_real_version: z.enum(["v1", "v2"]).optional(),
  preset_style: z.string().optional(),
  guidance_scale: z.number().optional(),
  num_inference_steps: z.number().int().optional(),
  seed: z.number().int().optional(),
  contrast: z.number().optional(),
  ultra: z.boolean().optional(),
  enhance_prompt: z.boolean().optional(),
  public: z.boolean().optional(),
});

const GenerateVideoSchema = z.object({
  image_id: z.string().min(1),
  motion_strength: z.number().int().min(1).max(10).optional(),
  is_public: z.boolean().optional(),
  is_init_image: z.boolean().optional(),
  image_type: z.enum(["GENERATED", "UPLOADED"]).optional(),
});

const UpscaleSchema = z.object({
  image_id: z.string().min(1),
  variation_type: z.enum(["UPSCALE", "HD", "UNZOOM"]).optional(),
});

const GetGenerationSchema = z.object({
  generation_id: z.string().min(1),
});

const server = new Server(
  { name: "mcp-leonardo", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "generate_image",
      description:
        "Generate an image with Leonardo AI. Returns image URLs and the generation id (usable as image_id for generate_video).",
      inputSchema: {
        type: "object",
        properties: {
          prompt: { type: "string", description: "Text prompt" },
          model_id: {
            type: "string",
            description:
              "Leonardo model UUID. If omitted, uses account default. Use list_models to browse.",
          },
          num_images: { type: "integer", minimum: 1, maximum: 8 },
          width: { type: "integer", minimum: 32, maximum: 2048 },
          height: { type: "integer", minimum: 32, maximum: 2048 },
          negative_prompt: { type: "string" },
          alchemy: { type: "boolean" },
          photo_real: { type: "boolean" },
          photo_real_version: { type: "string", enum: ["v1", "v2"] },
          preset_style: { type: "string" },
          guidance_scale: { type: "number" },
          num_inference_steps: { type: "integer" },
          seed: { type: "integer" },
          contrast: { type: "number" },
          ultra: { type: "boolean" },
          enhance_prompt: { type: "boolean" },
          public: { type: "boolean" },
        },
        required: ["prompt"],
      },
    },
    {
      name: "generate_video",
      description:
        "Animate a Leonardo image into a short MP4 video using Motion (SVD). image_id is a generated_images[].id from a prior generate_image result.",
      inputSchema: {
        type: "object",
        properties: {
          image_id: {
            type: "string",
            description: "Leonardo image id (generated_images[].id).",
          },
          motion_strength: { type: "integer", minimum: 1, maximum: 10 },
          is_public: { type: "boolean" },
          is_init_image: { type: "boolean" },
          image_type: { type: "string", enum: ["GENERATED", "UPLOADED"] },
        },
        required: ["image_id"],
      },
    },
    {
      name: "upscale_image",
      description: "Upscale a Leonardo image to higher resolution.",
      inputSchema: {
        type: "object",
        properties: {
          image_id: { type: "string" },
          variation_type: {
            type: "string",
            enum: ["UPSCALE", "HD", "UNZOOM"],
          },
        },
        required: ["image_id"],
      },
    },
    {
      name: "get_generation",
      description: "Fetch a generation by id (image or video).",
      inputSchema: {
        type: "object",
        properties: { generation_id: { type: "string" } },
        required: ["generation_id"],
      },
    },
    {
      name: "list_models",
      description: "List Leonardo platform models with their UUIDs.",
      inputSchema: { type: "object", properties: {} },
    },
    {
      name: "get_user_info",
      description: "Return account info including remaining credits.",
      inputSchema: { type: "object", properties: {} },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (req) => {
  const name = req.params.name;
  const args = req.params.arguments ?? {};

  try {
    switch (name) {
      case "generate_image": {
        const p = GenerateImageSchema.parse(args);
        const result = await client.generateImage({
          prompt: p.prompt,
          modelId: p.model_id,
          num_images: p.num_images,
          width: p.width,
          height: p.height,
          negative_prompt: p.negative_prompt,
          alchemy: p.alchemy,
          photoReal: p.photo_real,
          photoRealVersion: p.photo_real_version,
          presetStyle: p.preset_style,
          guidance_scale: p.guidance_scale,
          num_inference_steps: p.num_inference_steps,
          seed: p.seed,
          contrast: p.contrast,
          ultra: p.ultra,
          enhancePrompt: p.enhance_prompt,
          public: p.public,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  generation_id: result.id,
                  status: result.status,
                  images: result.images.map((img) => ({
                    id: img.id,
                    url: img.url,
                  })),
                },
                null,
                2,
              ),
            },
          ],
        };
      }
      case "generate_video": {
        const p = GenerateVideoSchema.parse(args);
        const result = await client.generateVideo({
          imageId: p.image_id,
          motionStrength: p.motion_strength,
          isPublic: p.is_public,
          isInitImage: p.is_init_image,
          imageType: p.image_type,
        });
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  generation_id: result.id,
                  status: result.status,
                  videos: result.images.map((img) => ({
                    id: img.id,
                    mp4_url: img.motionMP4URL,
                  })),
                },
                null,
                2,
              ),
            },
          ],
        };
      }
      case "upscale_image": {
        const p = UpscaleSchema.parse(args);
        const result = await client.upscaleImage({
          imageId: p.image_id,
          variationType: p.variation_type,
        });
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "get_generation": {
        const p = GetGenerationSchema.parse(args);
        const result = await client.getGeneration(p.generation_id);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  generation_id: result.id,
                  status: result.status,
                  images: result.images,
                },
                null,
                2,
              ),
            },
          ],
        };
      }
      case "list_models": {
        const result = await client.listPlatformModels();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      case "get_user_info": {
        const result = await client.getUserInfo();
        return {
          content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
        };
      }
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return {
      isError: true,
      content: [{ type: "text", text: `Error: ${message}` }],
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("[mcp-leonardo] listening on stdio");
}

main().catch((err) => {
  console.error("[mcp-leonardo] fatal:", err);
  process.exit(1);
});
