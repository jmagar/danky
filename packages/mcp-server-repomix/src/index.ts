#!/usr/bin/env node
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { spawn } from 'child_process';

const REPOMIX_TOOL = {
  name: "repomix",
  description: "Run repomix on a specified directory to analyze the repository",
  inputSchema: {
    type: "object",
    properties: {
      directory: {
        type: "string",
        description: "Directory to analyze"
      }
    },
    required: ["directory"]
  }
};

async function runRepomix(directory: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const repomix = spawn('repomix', [directory]);
    let output = '';
    let error = '';

    repomix.stdout.on('data', (data) => {
      output += data.toString();
    });

    repomix.stderr.on('data', (data) => {
      error += data.toString();
    });

    repomix.on('close', (code) => {
      if (code === 0) {
        resolve(output);
      } else {
        reject(new Error(`Repomix failed with code ${code}: ${error}`));
      }
    });
  });
}

async function runServer() {
  const transport = new StdioServerTransport();
  const server = new Server({
    name: "repomix",
    version: "1.0.0"
  }, {
    capabilities: {
      experimental: {}
    }
  });

  server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
      tools: [REPOMIX_TOOL]
    };
  });

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, args } = request.params;

    if (name !== "repomix") {
      throw new Error(`Unknown tool: ${name}`);
    }

    const { directory } = args as { directory: string };
    const result = await runRepomix(directory);

    return {
      result
    };
  });

  await server.connect(transport);
}

runServer().catch((error) => {
  console.error(error);
  process.exit(1);
}); 