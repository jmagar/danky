import Anthropic from '@anthropic-ai/sdk';
import { env } from '@/env';
import { createLogger } from '@danky/logger';

const logger = createLogger('anthropic');

export const anthropic = new Anthropic({
  apiKey: env.ANTHROPIC_API_KEY,
});

export async function streamCompletion(
  messages: Array<{ role: string; content: string }>,
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  } = {}
) {
  const { model = 'claude-3-opus-20240229', temperature = 0.7, maxTokens = 4096 } = options;

  try {
    const response = await anthropic.messages.create({
      model,
      messages: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content,
      })),
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    return response;
  } catch (error) {
    logger.error({ error }, 'Anthropic completion failed');
    throw error;
  }
}
