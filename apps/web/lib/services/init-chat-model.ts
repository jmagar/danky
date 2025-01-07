import { ChatOpenAI } from '@langchain/openai'
import { ChatAnthropic } from '@langchain/anthropic'
import { ChatGroq } from '@langchain/groq'
import { BaseChatModel } from '@langchain/core/language_models/chat_models'

type LLMConfig = {
  provider: 'openai' | 'anthropic' | 'groq'
  model: string
  apiKey: string
  temperature?: number
  maxTokens?: number
}

export function initChatModel(config: LLMConfig): BaseChatModel {
  const { provider, model, apiKey, temperature = 0.7, maxTokens = 1000 } = config

  switch (provider) {
    case 'openai':
      return new ChatOpenAI({
        modelName: model,
        openAIApiKey: apiKey,
        temperature,
        maxTokens,
      })
    case 'anthropic':
      return new ChatAnthropic({
        modelName: model,
        anthropicApiKey: apiKey,
        temperature,
        maxTokens,
      })
    case 'groq':
      return new ChatGroq({
        modelName: model,
        apiKey: apiKey,
        temperature,
        maxTokens,
      })
    default:
      throw new Error(`Unsupported LLM provider: ${provider}`)
  }
} 