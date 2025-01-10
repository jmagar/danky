// Copyright (C) 2024 Hideya Kawahara
// SPDX-License-Identifier: MIT

import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import { ChatGroq } from '@langchain/groq';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { LLMConfig } from "./load-config";

export function initChatModel(config: LLMConfig): BaseChatModel {
  let model: BaseChatModel;

  const llmConfig = {
    modelName: config.model,
    temperature: config.temperature ?? 0.7,
    maxTokens: config.maxTokens ?? undefined,
  };

  switch (config.provider?.toLowerCase()) {
    case "openai": {
      const openaiApiKey = config.apiKey ?? process.env["OPENAI_API_KEY"];
      if (!openaiApiKey) {
        throw new Error("OpenAI API key not found");
      }
      model = new ChatOpenAI({
        apiKey: openaiApiKey,
        modelName: config.model ?? "gpt-4",
        temperature: llmConfig.temperature,
        maxTokens: config.maxTokens ?? 4096,
      });
      break;
    }

    case "anthropic": {
      const anthropicApiKey = config.apiKey ?? process.env["ANTHROPIC_API_KEY"];
      if (!anthropicApiKey) {
        throw new Error("Anthropic API key not found");
      }
      model = new ChatAnthropic({
        apiKey: anthropicApiKey,
        model: config.model ?? "claude-3-opus-20240229",
        temperature: llmConfig.temperature,
        maxTokens: llmConfig.maxTokens ?? 4096,
      });
      break;
    }

    case "groq": {
      const groqApiKey = config.apiKey ?? process.env["GROQ_API_KEY"];
      if (!groqApiKey) {
        throw new Error("Groq API key not found");
      }
      model = new ChatGroq({
        apiKey: groqApiKey,
        model: config.model ?? "mixtral-8x7b-32768",
        temperature: llmConfig.temperature,
        maxTokens: llmConfig.maxTokens ?? 4096,
      });
      break;
    }

    default:
      throw new Error(`Unsupported provider: ${config.provider}`);
  }

  return model;
}
