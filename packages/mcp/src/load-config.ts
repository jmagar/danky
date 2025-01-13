// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

import JSON5 from 'json5';
import { readFileSync } from 'fs';

// Validate required environment variables
function validateEnvironmentVariables(config: Config): void {
  const missingVars = new Set<string>();

  // Check LLM API keys
  if (config.llm.apiKey !== undefined && config.llm.apiKey.includes('${')) {
    const matches = config.llm.apiKey.match(/\$\{([^}]+)\}/g);
    if (matches !== null) {
      for (const match of matches) {
        const envVar = match.slice(2, -1);
        if (process.env[envVar] === undefined) {
          throw new Error(`Missing environment variable: ${envVar}`);
        }
      }
    }
  }

  // Check server environment variables
  for (const [, server] of Object.entries(config.mcpServers)) {
    const serverEnv = server.env ?? {};
    for (const value of Object.values(serverEnv)) {
      if (value.includes('${')) {
        const matches = value.match(/\$\{([^}]+)\}/g);
        if (matches !== null) {
          for (const match of matches) {
            const varName = match.slice(2, -1);
            if (process.env[varName] === undefined) {
              missingVars.add(varName);
            }
          }
        }
      }
    }
  }

  if (missingVars.size > 0) {
    throw new Error(
      `Missing required environment variables: ${Array.from(missingVars).join(', ')}. Make sure these are set in the root .env file.`
    );
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
  };
}

export function loadConfig(configPath: string): Config {
  let fileContents: string;
  try {
    fileContents = readFileSync(configPath, 'utf-8');
  } catch (error) {
    throw new Error(
      `Config file not found at "${configPath}". Error: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  // Replace environment variables in the format ${VAR_NAME} with their values
  const configWithEnvVars = Object.entries(process.env).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      const regex = new RegExp(`\\$\{${key}}`, 'g');
      return acc.replace(regex, value);
    }
    return acc;
  }, fileContents);

  let config: unknown;
  try {
    config = JSON5.parse(configWithEnvVars);
  } catch (error) {
    throw new Error(
      `Failed to parse config file: ${error instanceof Error ? error.message : String(error)}`
    );
  }

  try {
    // Validate required fields
    validateConfig(config);

    // Validate environment variables
    validateEnvironmentVariables(config);

    return config;
  } catch (error) {
    throw new Error(
      `Failed to load configuration from "${configPath}": ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

function validateConfig(config: unknown): asserts config is Config {
  if (config === null || typeof config !== 'object') {
    throw new Error('Configuration must be an object');
  }

  const configObj = config as Record<string, unknown>;

  if (configObj.llm === null || typeof configObj.llm !== 'object') {
    throw new Error('LLM configuration is required and must be an object');
  }
  validateLLMConfig(configObj.llm);

  if (configObj.mcpServers === null || typeof configObj.mcpServers !== 'object') {
    throw new Error('mcpServers must be an object');
  }

  const servers = configObj.mcpServers as Record<string, unknown>;
  for (const [key, value] of Object.entries(servers)) {
    try {
      validateMCPServerConfig(value);
    } catch (error) {
      throw new Error(
        `Invalid configuration for MCP server "${key}": ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

function validateLLMConfig(llmConfig: unknown): asserts llmConfig is LLMConfig {
  if (llmConfig === null || typeof llmConfig !== 'object') {
    throw new Error('LLM configuration must be an object');
  }

  const config = llmConfig as Record<string, unknown>;

  if (typeof config.provider !== 'string' || config.provider === '') {
    throw new Error('LLM provider must be a non-empty string');
  }

  if (
    'model' in config &&
    (config.model === null || typeof config.model !== 'string' || config.model === '')
  ) {
    throw new Error('LLM model must be a non-empty string if provided');
  }

  if (
    'modelName' in config &&
    (config.modelName === null || typeof config.modelName !== 'string' || config.modelName === '')
  ) {
    throw new Error('LLM modelName must be a non-empty string if provided');
  }

  if (
    'temperature' in config &&
    (config.temperature === null || typeof config.temperature !== 'number')
  ) {
    throw new Error('LLM temperature must be a number if provided');
  }

  if (
    'maxTokens' in config &&
    (config.maxTokens === null || typeof config.maxTokens !== 'number')
  ) {
    throw new Error('LLM maxTokens must be a number if provided');
  }

  if (
    'apiKey' in config &&
    (config.apiKey === null || typeof config.apiKey !== 'string' || config.apiKey === '')
  ) {
    throw new Error('LLM apiKey must be a non-empty string if provided');
  }
}

function validateMCPServerConfig(serverConfig: unknown): asserts serverConfig is MCPServerConfig {
  if (serverConfig === null || typeof serverConfig !== 'object') {
    throw new Error('MCP server configuration must be an object');
  }

  const config = serverConfig as Record<string, unknown>;

  if (typeof config.command !== 'string' || config.command === '') {
    throw new Error('MCP server command must be a non-empty string');
  }

  if (!Array.isArray(config.args)) {
    throw new Error('MCP server args must be an array');
  }

  if (!config.args.every(arg => typeof arg === 'string' && arg !== '')) {
    throw new Error('All MCP server args must be non-empty strings');
  }

  if ('env' in config) {
    if (config.env === null || typeof config.env !== 'object') {
      throw new Error('MCP server env must be an object if provided');
    }

    const env = config.env as Record<string, unknown>;
    if (!Object.values(env).every(value => typeof value === 'string' && value !== '')) {
      throw new Error('All MCP server env values must be non-empty strings');
    }
  }
}
