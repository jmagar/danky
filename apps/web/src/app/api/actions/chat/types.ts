import { z } from 'zod';
import { webListMessagesSchema } from '@/lib/validations/chat';

// Re-export the type from list-messages.ts instead of duplicating it
export type { ListMessagesParams } from './list-messages';
