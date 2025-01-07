// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

import JSON5 from 'json5';
import { readFileSync } from 'fs';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from root .env file
const rootEnvPath = path.resolve(__dirname, '../../../.env');
dotenv.config({ path: rootEnvPath });

// Validate required environment variables
function validateEnvironmentVariables(config: Config): void {
  const missingVars = new Set<string>();

  // Check LLM API keys
  if (config.llm?.apiKey?.includes('${')) {
    const matches = config.llm.apiKey.match(/\$\{([^}]+)\}/g);
    if (matches) {
      matches.forEach(match => {
        const varName = match.slice(2, -1);
        if (!process.env[varName]) {
          missingVars.add(varName);
        }
      });
    }
  }

  // Check server environment variables
  Object.entries(config.mcpServers || {}).forEach(([serverName, server]) => {
    if (server.env) {
      Object.values(server.env).forEach(value => {
        if (typeof value === 'string' && value.includes('${')) {
          const matches = value.match(/\$\{([^}]+)\}/g);
          if (matches) {
            matches.forEach(match => {
              const varName = match.slice(2, -1);
              if (!process.env[varName]) {
                missingVars.add(varName);
              }
            });
          }
        }
      });
    }
  });

  if (missingVars.size > 0) {
    throw new Error(`Missing required environment variables: ${Array.from(missingVars).join(', ')}. Make sure these are set in the root .env file.`);
  }
}

export interface LLMConfig {
  provider: string;
  model?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
}

export interface MCPServerConfig {
  command: string;
  args: string[];
  env?: Record<string, string>;
}

export interface Config {
  llm: LLMConfig;
  mcpServers: {
    [key: string]: MCPServerConfig;
  }
}

export function loadConfig(configPath: string): Config {
  try {
    let json5Str = readFileSync(configPath, 'utf-8');

    // Replace environment variables in the format ${VAR_NAME} with their values
    Object.entries(process.env).forEach(([key, value]) => {
      const regex = new RegExp(`\\$\{${key}\}`, 'g');
      if (value) {
        json5Str = json5Str.replace(regex, value);
      }
    });

    const config = JSON5.parse(json5Str);

    // Validate required fields
    validateConfig(config);

    // Validate environment variables
    validateEnvironmentVariables(config);

    return config;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load configuration from "${configPath}": ${error.message}`);
    }
    throw error;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateConfig(config: any): asserts config is Config {
  if (typeof config !== 'object' || config === null) {
    throw new Error('Configuration must be an object');
  }

  if (!config.llm) {
    throw new Error('LLM configuration is required');
  }
  validateLLMConfig(config.llm);

  if (typeof config.mcpServers !== 'object' || config.mcpServers === null) {
    throw new Error('mcpServers must be an object');
  }

  Object.entries(config.mcpServers).forEach(([key, value]) => {
    try {
      validateMCPServerConfig(value);
    } catch (error) {
      throw new Error(`Invalid configuration for MCP server "${key}": ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateLLMConfig(llmConfig: any): asserts llmConfig is LLMConfig {
  if (typeof llmConfig !== 'object' || llmConfig === null) {
    throw new Error('LLM configuration must be an object');
  }

  if (typeof llmConfig.provider !== 'string') {
    throw new Error('LLM provider must be a string');
  }

  if (llmConfig.model !== undefined && typeof llmConfig.model !== 'string') {
    throw new Error('LLM model must be a string if provided');
  }

  if (llmConfig.modelName !== undefined && typeof llmConfig.modelName !== 'string') {
    throw new Error('LLM modelName must be a string if provided');
  }

  if (llmConfig.temperature !== undefined && typeof llmConfig.temperature !== 'number') {
    throw new Error('LLM temperature must be a number if provided');
  }

  if (llmConfig.maxTokens !== undefined && typeof llmConfig.maxTokens !== 'number') {
    throw new Error('LLM maxTokens must be a number if provided');
  }

  if (llmConfig.apiKey !== undefined && typeof llmConfig.apiKey !== 'string') {
    throw new Error('LLM apiKey must be a string if provided');
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function validateMCPServerConfig(serverConfig: any): asserts serverConfig is MCPServerConfig {
  if (typeof serverConfig !== 'object' || serverConfig === null) {
    throw new Error('MCP server configuration must be an object');
  }

  if (typeof serverConfig.command !== 'string') {
    throw new Error('MCP server command must be a string');
  }

  if (!Array.isArray(serverConfig.args)) {
    throw new Error('MCP server args must be an array');
  }

  if (serverConfig.args.some((arg: unknown) => typeof arg !== 'string')) {
    throw new Error('All MCP server args must be strings');
  }

  if (serverConfig.env !== undefined) {
    if (typeof serverConfig.env !== 'object' || serverConfig.env === null) {
      throw new Error('MCP server env must be an object if provided');
    }

    // Validate that all env values are strings
    for (const [, value] of Object.entries(serverConfig.env)) {
      if (typeof value !== 'string') {
        throw new Error('All MCP server env values must be strings');
      }
    }
  }
}
