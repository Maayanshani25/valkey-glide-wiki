import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

// Create an MCP server with a name and version
const server = new McpServer({
  name: "valkey-glide-migration-server",
  version: "1.0.0"
});

// todo: replace with actual resource templates (querying the github wiki / storing the markdown)
// Placeholder: In practice, load or fetch the actual markdown content from the Valkey-Glide wiki.
const guides: Record<string, string> = {
  "go-redis": "*Valkey-Glide Migration Guide for go-redis...* (guide content goes here)",
  "ioredis" : "*Valkey-Glide Migration Guide for ioredis...* (guide content goes here)",
  "jedis"   : "*Valkey-Glide Migration Guide for Jedis...* (guide content goes here)",
  "lettuce" : "*Valkey-Glide Migration Guide for Lettuce...* (guide content goes here)",
  "redisson": "*Valkey-Glide Migration Guide for Redisson...* (guide content goes here)",
  "redis-py": "*Valkey-Glide Migration Guide for redis-py...* (guide content goes here)",
};

server.registerResource(
  "migrationGuide", 
  new ResourceTemplate("migration-guide://{client}", { list: undefined }),
  {
    title: "Migration Guides",
    description: "Valkey-Glide migration guide for a given client",
    mimeType: "text/markdown"  // We will serve guides in Markdown format
  },
  async (uri, { client }) => {
    const guideContent = guides[client.toString()];
    if (!guideContent) {
      // If we don't have that client guide, return an empty result or an error message
      return { contents: [{ uri: uri.href, text: `No guide found for client: ${client}` }] };
    }
    return {
      contents: [
        {
          uri: uri.href,
          text: guideContent  // The guide content in Markdown
        }
      ]
    };
  }
);

