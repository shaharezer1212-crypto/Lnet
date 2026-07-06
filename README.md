# Lnet — Leonardo AI MCP integration

An MCP server + CLI for generating images and videos with
[Leonardo AI](https://leonardo.ai) from any Claude client.

- **`mcp-leonardo/`** — TypeScript MCP server (stdio). Exposes
  `generate_image`, `generate_video`, `upscale_image`, `get_generation`,
  `list_models`, `get_user_info`. See [`mcp-leonardo/README.md`](mcp-leonardo/README.md).
- **`scripts/leonardo-cli.mjs`** — Zero-dep Node CLI that talks directly to
  the Leonardo REST API. Useful for smoke testing or for running inside a
  Claude Code session before the MCP server is registered with a client.

## Quick start

```bash
# 1. Build the MCP server
cd mcp-leonardo
npm install
npm run build

# 2. Get an API key from https://app.leonardo.ai/api-access
export LEONARDO_API_KEY=sk-…

# 3. Try the CLI
node ../scripts/leonardo-cli.mjs me
node ../scripts/leonardo-cli.mjs image --prompt "a cozy library at dusk"

# 4. Register the server with your MCP client — see mcp-leonardo/README.md
```
