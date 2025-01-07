// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGroq } from '@langchain/groq';
import { type BaseChatModel } from '@langchain/core/language_models/chat_models';
import { type Tool } from '@langchain/core/tools';

// FIXME: no typescript version of init_chat_model()? (or the Python version is gone?)
// Ref: https://python.langchain.com/api_reference/langchain/chat_models/langchain.chat_models.base.init_chat_model.html
// Ref: https://v03.api.js.langchain.com/classes/_langchain_core.language_models_chat_models.BaseChatModel.html

interface ChatModelConfig {
  provider: string;
  apiKey?: string;
  model?: string;
  modelName?: string;
  temperature?: number;
  maxTokens?: number,
  tools?: Tool[];
}

export function initChatModel(config: ChatModelConfig): BaseChatModel {
  let model: BaseChatModel;

  // remove unnecessary properties
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { provider, tools, apiKey, ...llmConfig } = config;

  try {
    switch (config.provider.toLowerCase()) {
      case 'openai':
        model = new ChatOpenAI({ ...llmConfig, apiKey: config.apiKey });
        break;

      case 'anthropic':
        // Use the API key from config or environment
        const anthropicApiKey = config.apiKey || process.env.ANTHROPIC_API_KEY;
        if (!anthropicApiKey) {
          throw new Error('ANTHROPIC_API_KEY not found in config or environment')
        }
        // Log the first and last 4 characters of the API key for debugging
        console.log('Using Anthropic API Key:', `${anthropicApiKey.slice(0, 4)}...${anthropicApiKey.slice(-4)}`);
        
        model = new ChatAnthropic({
          apiKey: anthropicApiKey,
          model: config.model || 'claude-3-opus-20240229',
          temperature: config.temperature,
          maxTokens: config.maxTokens
        });
        break;

      case 'groq':
        // Use the API key from config or environment
        const groqApiKey = config.apiKey || process.env.GROQ_API_KEY;
        if (!groqApiKey) {
          throw new Error('GROQ_API_KEY not found in config or environment')
        }
        model = new ChatGroq({ ...llmConfig, apiKey: groqApiKey });
        break;

      default:
        throw new Error(
          `Unsupported provider: ${config.provider}`,
        );
    }

    if (typeof model?.bindTools === 'function') {
      if (config.tools && config.tools.length > 0) {
        // FIXME
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        model = (model as { bindTools: Function }).bindTools(config.tools);
      }
    } else {
      throw new Error(
        `Tool calling unsupported by provider: ${config.provider}`,
      );
    }

    return model;
  } catch (error) {
    throw new Error(`Failed to initialize chat model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
