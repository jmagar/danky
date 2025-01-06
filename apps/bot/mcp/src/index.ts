// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { MemorySaver } from '@langchain/langgraph';
import { HumanMessage } from '@langchain/core/messages';
import { convertMCPServersToLangChainTools, type MCPServerCleanupFunction } from './servers/mcp-server-langchain-tool.js';
import { initChatModel } from './init-chat-model.js';
import { loadConfig, type Config } from './load-config.js';
import readline from 'readline';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config({ path: '../../../.env' });

// Constants
const DEFAULT_CONFIG_PATH = '../../../mcp-config.json5';

const SAMPLE_QUERIES = [
  'Whats the weather like in SF?',
  'Read and briefly summarize the file ./LICENSE',
  'Read the news headlines on cnn.com?',
  // 'Show me the page cnn.com',
] as const;

const COLORS = {
  YELLOW: '\x1b[33m',
  CYAN: '\x1b[36m',
  RESET: '\x1b[0m'
} as const;

// CLI argument setup
interface Arguments {
  config: string;
  [key: string]: unknown;
}

const parseArguments = (): Arguments => {
  return yargs(hideBin(process.argv))
    .options({
      config: {
        type: 'string',
        description: 'Path to config file',
        demandOption: false
      },
    })
    .help()
    .alias('help', 'h')
    .parseSync() as Arguments;
};

// Input handling
const createReadlineInterface = () => {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
};

const getInput = (rl: readline.Interface, prompt: string): Promise<string> => {
  return new Promise((resolve) => rl.question(prompt, resolve));
};

async function getUserQuery(
  rl: readline.Interface,
  remainingQueries: string[]
): Promise<string | undefined> {
  const input = await getInput(rl, `${COLORS.YELLOW}Query: `);
  process.stdout.write(COLORS.RESET);
  const query = input.trim();

  if (query.toLowerCase() === 'quit' || query.toLowerCase() === 'q') {
    rl.close();
    return undefined;
  }

  if (query === '') {
    const sampleQuery = remainingQueries.shift();
    if (!sampleQuery) {
      console.log('\nPlease type a query, or "quit" or "q" to exit\n');
      return await getUserQuery(rl, remainingQueries);
    }
    process.stdout.write('\x1b[1A\x1b[2K'); // Move up and clear the line
    console.log(`${COLORS.YELLOW}Sample Query: ${sampleQuery}${COLORS.RESET}`);
    return sampleQuery;
  }

  return query;
}

// Conversation loop
async function handleConversation(
  agent: ReturnType<typeof createReactAgent>,
  remainingQueries: string[]
): Promise<void> {
  console.log('\nConversation started. Type "quit" or "q" to end the conversation.\n');
  console.log('Sample Queries (type just enter to supply them one by one):');
  remainingQueries.forEach(query => console.log(`- ${query}`));
  console.log();

  const rl = createReadlineInterface();
 
  while (true) {
    const query = await getUserQuery(rl, remainingQueries);
    console.log();

    if (!query) {
      console.log(`${COLORS.CYAN}Goodbye!${COLORS.RESET}\n`);
      return;
    }

    const agentFinalState = await agent.invoke(
      { messages: [new HumanMessage(query)] },
      { configurable: { thread_id: 'test-thread' } }
    );

    const result = agentFinalState.messages[agentFinalState.messages.length - 1].content;

    console.log(`${COLORS.CYAN}${result}${COLORS.RESET}\n`);
  }
}

// Application initialization
async function initializeReactAgent(config: Config) {
  console.log('Initializing model...', config.llm, '\n');
  const llmModel = initChatModel(config.llm);

  console.log(`Initializing ${Object.keys(config.mcpServers).length} MCP server(s)...\n`);
  const { allTools, cleanup } = await convertMCPServersToLangChainTools(
    config.mcpServers,
    { logLevel: 'info' }
  );

  const agent = createReactAgent({
    llm: llmModel,
    tools: allTools,
    checkpointSaver: new MemorySaver(),
  });

  return { agent, cleanup };
}

// Main
async function main(): Promise<void> {
  let mcpCleanup: MCPServerCleanupFunction | undefined;

  try {
    const argv = parseArguments();
    const configPath = argv.config || process.env.CONFIG_FILE || DEFAULT_CONFIG_PATH;
    const config = loadConfig(configPath);

    const { agent, cleanup } = await initializeReactAgent(config);
    mcpCleanup = cleanup;

    await handleConversation(agent, [...SAMPLE_QUERIES]);

  } finally {
    if (mcpCleanup) {
      await mcpCleanup();
    }
  }
}

// Application entry point with error handling
main().catch((error: unknown) => {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  console.error(errorMessage, error);
  process.exit(1);
});
