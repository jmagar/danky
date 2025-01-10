import { z } from 'zod';

// Model configuration metadata
export const modelConfigSchema = z.object({
  temperature: z.number().min(0).max(2).optional(),
  topP: z.number().min(0).max(1).optional(),
  frequencyPenalty: z.number().min(-2).max(2).optional(),
  presencePenalty: z.number().min(-2).max(2).optional(),
  maxTokens: z.number().positive().max(32000).optional(),
  stop: z.array(z.string()).max(4).optional(),
});

// Valid model IDs
export const MODEL_IDS = [
  'gpt-4-turbo-preview',
  'gpt-4',
  'gpt-3.5-turbo',
  'claude-3-opus',
  'claude-3-sonnet',
  'claude-2',
  'gemini-pro',
  'mistral-medium',
  'mixtral-8x7b',
] as const;

// Message metadata
export const messageMetadataSchema = z.object({
  tokens: z.object({
    prompt: z.number().nonnegative(),
    completion: z.number().nonnegative(),
    total: z.number().nonnegative(),
  }).optional(),
  model: z.object({
    id: z.enum(MODEL_IDS),
    provider: z.enum(['openai', 'anthropic', 'google', 'mistral']),
    config: modelConfigSchema.optional(),
  }).optional(),
  timing: z.object({
    startedAt: z.date(),
    completedAt: z.date(),
    latencyMs: z.number().nonnegative(),
  }).optional(),
  error: z.object({
    code: z.string(),
    message: z.string(),
    type: z.enum(['rate_limit', 'token_limit', 'context_length', 'invalid_request', 'server_error']),
  }).optional(),
  tools: z.array(z.object({
    name: z.string(),
    args: z.record(z.unknown()),
    result: z.unknown(),
    error: z.string().optional(),
  })).optional(),
});

// Session metadata
export const sessionMetadataSchema = z.object({
  model: z.object({
    id: z.enum(MODEL_IDS),
    provider: z.enum(['openai', 'anthropic', 'google', 'mistral']),
    config: modelConfigSchema,
  }),
  purpose: z.enum(['chat', 'completion', 'analysis', 'coding', 'other']),
  tags: z.array(z.string()).max(10).optional(),
  language: z.string().optional(), // For coding sessions
  framework: z.string().optional(), // For coding sessions
  context: z.object({
    systemPrompt: z.string().optional(),
    documents: z.array(z.object({
      id: z.string(),
      type: z.enum(['file', 'url', 'text']),
      name: z.string(),
      summary: z.string().optional(),
    })).optional(),
  }).optional(),
  stats: z.object({
    messageCount: z.number().nonnegative(),
    totalTokens: z.number().nonnegative(),
    averageLatencyMs: z.number().nonnegative(),
    lastActive: z.date(),
  }).optional(),
});

// Content validation
export const textContentSchema = z.object({
  type: z.literal('text'),
  content: z.string().max(32000), // OpenAI's max token limit
});

export const codeContentSchema = z.object({
  type: z.literal('code'),
  content: z.string().max(32000),
  language: z.string(),
  fileName: z.string().optional(),
  lineNumbers: z.boolean().optional(),
});

export const imageContentSchema = z.object({
  type: z.literal('image'),
  content: z.string().url(),
  mimeType: z.enum(['image/png', 'image/jpeg', 'image/gif', 'image/webp']),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  altText: z.string().optional(),
});

export const fileContentSchema = z.object({
  type: z.literal('file'),
  content: z.string().url(),
  mimeType: z.string(),
  fileName: z.string(),
  fileSize: z.number().positive(),
  checksum: z.string().optional(),
});

// Combined content schema
export const messageContentSchema = z.discriminatedUnion('type', [
  textContentSchema,
  codeContentSchema,
  imageContentSchema,
  fileContentSchema,
]); 