// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGroq } from '@langchain/groq';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { LLMConfig } from './load-config';

export function initChatModel(config: LLMConfig): BaseChatModel {
  const provider = config.provider.toLowerCase();
  const temperature = config.temperature ?? 0.7;
  const maxTokens = config.maxTokens ?? 4096;

  switch (provider) {
    case 'openai': {
      const openaiApiKey = config.apiKey ?? process.env['OPENAI_API_KEY'];
      if (typeof openaiApiKey !== 'string' || !openaiApiKey) {
        throw new Error('OpenAI API key not found');
      }
      return new ChatOpenAI({
        apiKey: openaiApiKey,
        modelName: config.model ?? 'gpt-4',
        temperature,
        maxTokens,
      });
    }

    case 'anthropic': {
      const anthropicApiKey = config.apiKey ?? process.env['ANTHROPIC_API_KEY'];
      if (typeof anthropicApiKey !== 'string' || !anthropicApiKey) {
        throw new Error('Anthropic API key not found');
      }
      return new ChatAnthropic({
        apiKey: anthropicApiKey,
        model: config.model ?? 'claude-3-opus-20240229',
        temperature,
        maxTokens,
      });
    }

    case 'groq': {
      const groqApiKey = config.apiKey ?? process.env['GROQ_API_KEY'];
      if (typeof groqApiKey !== 'string' || !groqApiKey) {
        throw new Error('Groq API key not found');
      }
      return new ChatGroq({
        apiKey: groqApiKey,
        model: config.model ?? 'mixtral-8x7b-32768',
        temperature,
        maxTokens,
      });
    }

    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }
}
