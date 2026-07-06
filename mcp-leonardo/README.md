# mcp-leonardo

A small MCP server that exposes [Leonardo AI](https://leonardo.ai) image and
video (Motion / SVD) generation to any MCP-capable client — Claude Desktop,
Claude Code, or Claude Agent SDK.

## Tools

| Tool | Purpose |
|------|---------|
| `generate_image` | Text-to-image. Returns `generation_id` and `images[]` (with `id` + `url`). |
| `generate_video` | Animate a Leonardo image via Motion (SVD). Takes an `image_id`. |
| `upscale_image` | Upscale a generated image. |
| `get_generation` | Fetch a generation by id. |
| `list_models` | List platform models with their UUIDs. |
| `get_user_info` | Account info + remaining credits. |

## Setup

```bash
cd mcp-leonardo
npm install
npm run build
```

Get an API key at <https://app.leonardo.ai/api-access> (paid plan required).

## Register with Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS)
or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "leonardo": {
      "command": "node",
      "args": ["/absolute/path/to/Lnet/mcp-leonardo/dist/index.js"],
      "env": {
        "LEONARDO_API_KEY": "sk-…"
      }
    }
  }
}
```

Restart Claude Desktop. The tools will appear under the `leonardo` server.

## Register with Claude Code (local CLI)

Add to `.claude/settings.json` in a project (or `~/.claude/settings.json`
globally):

```json
{
  "mcpServers": {
    "leonardo": {
      "command": "node",
      "args": ["/absolute/path/to/Lnet/mcp-leonardo/dist/index.js"],
      "env": { "LEONARDO_API_KEY": "sk-…" }
    }
  }
}
```

## Quick smoke test

```bash
export LEONARDO_API_KEY=sk-…
node ../scripts/leonardo-cli.mjs me
node ../scripts/leonardo-cli.mjs image --prompt "a cozy library at dusk"
```

## Notes

- Generations are asynchronous on Leonardo's side; both the MCP server and
  the CLI poll `/generations/{id}` every 4 s until `COMPLETE` (5 min timeout
  for images, 8 min for videos).
- The `generate_video` tool consumes an `image_id` (a
  `generated_images[].id`) produced by `generate_image`; pass that id, not
  the image URL.
- All parameters mirror the Leonardo REST API. See
  <https://docs.leonardo.ai> for available `model_id` UUIDs and preset
  styles.
