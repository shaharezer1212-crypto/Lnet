const BASE_URL = "https://cloud.leonardo.ai/api/rest/v1";

export interface LeonardoOptions {
  apiKey: string;
  baseUrl?: string;
  pollIntervalMs?: number;
  pollTimeoutMs?: number;
}

export interface GeneratedImage {
  id: string;
  url: string;
  nsfw?: boolean;
  motionMP4URL?: string | null;
}

export interface GenerationResult {
  id: string;
  status: "PENDING" | "COMPLETE" | "FAILED";
  prompt?: string;
  modelId?: string | null;
  images: GeneratedImage[];
  raw: unknown;
}

export interface ImageGenParams {
  prompt: string;
  modelId?: string;
  width?: number;
  height?: number;
  num_images?: number;
  negative_prompt?: string;
  alchemy?: boolean;
  photoReal?: boolean;
  photoRealVersion?: "v1" | "v2";
  presetStyle?: string;
  guidance_scale?: number;
  num_inference_steps?: number;
  seed?: number;
  public?: boolean;
  contrast?: number;
  ultra?: boolean;
  enhancePrompt?: boolean;
}

export interface MotionGenParams {
  imageId: string;
  motionStrength?: number;
  isPublic?: boolean;
  isInitImage?: boolean;
  imageType?: "GENERATED" | "UPLOADED";
}

export interface UpscaleParams {
  imageId: string;
  variationType?: "UPSCALE" | "HD" | "UNZOOM";
}

export class LeonardoClient {
  private apiKey: string;
  private baseUrl: string;
  private pollIntervalMs: number;
  private pollTimeoutMs: number;

  constructor(opts: LeonardoOptions) {
    if (!opts.apiKey) throw new Error("LEONARDO_API_KEY is required");
    this.apiKey = opts.apiKey;
    this.baseUrl = opts.baseUrl ?? BASE_URL;
    this.pollIntervalMs = opts.pollIntervalMs ?? 4000;
    this.pollTimeoutMs = opts.pollTimeoutMs ?? 5 * 60 * 1000;
  }

  private async request<T>(
    path: string,
    init: RequestInit = {},
  ): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
    });
    const text = await res.text();
    let body: unknown;
    try {
      body = text ? JSON.parse(text) : {};
    } catch {
      body = text;
    }
    if (!res.ok) {
      const msg =
        typeof body === "object" && body && "error" in body
          ? JSON.stringify(body)
          : text || res.statusText;
      throw new Error(`Leonardo API ${res.status}: ${msg}`);
    }
    return body as T;
  }

  async getUserInfo(): Promise<unknown> {
    return this.request("/me", { method: "GET" });
  }

  async listPlatformModels(): Promise<unknown> {
    return this.request("/platformModels", { method: "GET" });
  }

  async createImageGeneration(params: ImageGenParams): Promise<string> {
    const body: Record<string, unknown> = {
      prompt: params.prompt,
      num_images: params.num_images ?? 1,
      width: params.width ?? 1024,
      height: params.height ?? 1024,
      public: params.public ?? false,
    };
    if (params.modelId) body.modelId = params.modelId;
    if (params.negative_prompt) body.negative_prompt = params.negative_prompt;
    if (params.alchemy !== undefined) body.alchemy = params.alchemy;
    if (params.photoReal !== undefined) body.photoReal = params.photoReal;
    if (params.photoRealVersion) body.photoRealVersion = params.photoRealVersion;
    if (params.presetStyle) body.presetStyle = params.presetStyle;
    if (params.guidance_scale !== undefined)
      body.guidance_scale = params.guidance_scale;
    if (params.num_inference_steps !== undefined)
      body.num_inference_steps = params.num_inference_steps;
    if (params.seed !== undefined) body.seed = params.seed;
    if (params.contrast !== undefined) body.contrast = params.contrast;
    if (params.ultra !== undefined) body.ultra = params.ultra;
    if (params.enhancePrompt !== undefined)
      body.enhancePrompt = params.enhancePrompt;

    const resp = await this.request<{
      sdGenerationJob?: { generationId: string; apiCreditCost?: number };
    }>("/generations", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const id = resp.sdGenerationJob?.generationId;
    if (!id) throw new Error(`No generationId in response: ${JSON.stringify(resp)}`);
    return id;
  }

  async getGeneration(generationId: string): Promise<GenerationResult> {
    const resp = await this.request<{
      generations_by_pk?: {
        id: string;
        status: "PENDING" | "COMPLETE" | "FAILED";
        prompt?: string;
        modelId?: string | null;
        generated_images?: Array<{
          id: string;
          url: string;
          nsfw?: boolean;
          motionMP4URL?: string | null;
        }>;
      };
    }>(`/generations/${generationId}`, { method: "GET" });

    const g = resp.generations_by_pk;
    if (!g) throw new Error(`Generation ${generationId} not found`);
    return {
      id: g.id,
      status: g.status,
      prompt: g.prompt,
      modelId: g.modelId,
      images: (g.generated_images ?? []).map((img) => ({
        id: img.id,
        url: img.url,
        nsfw: img.nsfw,
        motionMP4URL: img.motionMP4URL ?? null,
      })),
      raw: resp,
    };
  }

  async waitForGeneration(
    generationId: string,
    onTick?: (status: string) => void,
  ): Promise<GenerationResult> {
    const deadline = Date.now() + this.pollTimeoutMs;
    let attempt = 0;
    while (Date.now() < deadline) {
      attempt++;
      const g = await this.getGeneration(generationId);
      onTick?.(g.status);
      if (g.status === "COMPLETE") return g;
      if (g.status === "FAILED") throw new Error(`Generation ${generationId} FAILED`);
      await new Promise((r) => setTimeout(r, this.pollIntervalMs));
    }
    throw new Error(
      `Timed out waiting for generation ${generationId} after ${this.pollTimeoutMs}ms`,
    );
  }

  async generateImage(
    params: ImageGenParams,
    onTick?: (status: string) => void,
  ): Promise<GenerationResult> {
    const id = await this.createImageGeneration(params);
    return this.waitForGeneration(id, onTick);
  }

  async createMotionGeneration(params: MotionGenParams): Promise<string> {
    const body: Record<string, unknown> = {
      imageId: params.imageId,
      motionStrength: params.motionStrength ?? 5,
      isPublic: params.isPublic ?? false,
    };
    if (params.isInitImage !== undefined) body.isInitImage = params.isInitImage;
    if (params.imageType) body.imageType = params.imageType;

    const resp = await this.request<{
      motionSvdGenerationJob?: {
        generationId: string;
        apiCreditCost?: number;
      };
    }>("/generations-motion-svd", {
      method: "POST",
      body: JSON.stringify(body),
    });

    const id = resp.motionSvdGenerationJob?.generationId;
    if (!id) throw new Error(`No motion generationId in response: ${JSON.stringify(resp)}`);
    return id;
  }

  async generateVideo(
    params: MotionGenParams,
    onTick?: (status: string) => void,
  ): Promise<GenerationResult> {
    const id = await this.createMotionGeneration(params);
    return this.waitForGeneration(id, onTick);
  }

  async upscaleImage(params: UpscaleParams): Promise<unknown> {
    const body: Record<string, unknown> = {
      id: params.imageId,
    };
    if (params.variationType) body.variationType = params.variationType;
    return this.request("/variations/upscale", {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async getVariation(variationId: string): Promise<unknown> {
    return this.request(`/variations/${variationId}`, { method: "GET" });
  }
}
