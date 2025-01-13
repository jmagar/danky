'use client';

import { create } from 'zustand';
import { type Message, type Session, messageContentSchema, textContentSchema } from '@danky/schema';
import { createMessage, listMessages } from '@/app/api/actions/chat';
import { type z } from 'zod';
import { webListMessagesSchema } from '@/lib/validations/chat';

type ChatStatus = 'idle' | 'loading' | 'error';

interface ChatStore {
  messages: Message[];
  sessions: Session[];
  currentSession: string | null;
  status: ChatStatus;
  isInitializing: boolean;
  isProcessing: boolean;
  error: string | null;
  addMessage: (message: Omit<Message, 'createdAt' | 'updatedAt'>) => void;
  sendMessage: (content: string) => Promise<void>;
  initialize: () => Promise<void>;
  createSession: () => void;
  setCurrentSession: (sessionId: string) => void;
  clearError: () => void;
}

// Helper to create a text content object
const createTextContent = (text: string): z.infer<typeof textContentSchema> => ({
  type: 'text',
  content: text,
});

export const useChatStore = create<ChatStore>((set, get) => ({
  messages: [],
  sessions: [],
  currentSession: null,
  status: 'idle',
  isInitializing: true,
  isProcessing: false,
  error: null,

  addMessage: (message: Omit<Message, 'createdAt' | 'updatedAt'>) => {
    const now = new Date();
    const newMessage = {
      ...message,
      createdAt: now,
      updatedAt: now,
      metadata: message.metadata || {},
    };

    set(state => ({
      messages: [...state.messages, newMessage],
      sessions: state.currentSession
        ? state.sessions.map(session =>
            session.id === state.currentSession
              ? {
                  ...session,
                  metadata: {
                    ...session.metadata,
                    lastMessage: message.content[0].content,
                  },
                  updatedAt: now,
                }
              : session
          )
        : state.sessions,
    }));
  },

  sendMessage: async (content: string) => {
    const { currentSession } = get();
    if (!currentSession) {
      set({ error: 'No active chat session' });
      return;
    }

    set({ isProcessing: true, error: null, status: 'loading' });

    try {
      // Add user message to UI immediately
      get().addMessage({
        id: crypto.randomUUID(),
        role: 'user',
        content: [createTextContent(content)],
        sessionId: currentSession,
      });

      // Send message to API
      const response = await createMessage({
        sessionId: currentSession,
        role: 'user',
        content: [createTextContent(content)],
      });

      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to send message');
      }

      // Add assistant message
      if (response.data.role === 'assistant') {
        get().addMessage({
          id: crypto.randomUUID(),
          role: 'assistant',
          content: response.data.content.map(c => ({
            type: c.type,
            content: c.content,
            ...(c.type === 'code' && { language: c.language }),
          })) as z.infer<typeof messageContentSchema>[],
          sessionId: currentSession,
        });
      }

      set({ status: 'idle' });
    } catch (error) {
      console.error('Error processing message:', error);
      set({
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
      // Add error message to chat
      get().addMessage({
        id: crypto.randomUUID(),
        role: 'assistant',
        content: [
          createTextContent(`Error: ${error instanceof Error ? error.message : String(error)}`),
        ],
        sessionId: currentSession,
      });
    } finally {
      set({ isProcessing: false });
    }
  },

  initialize: async () => {
    set({ isInitializing: true, error: null, status: 'loading' });

    try {
      // Get initial messages if there's a current session
      const { currentSession } = get();
      if (currentSession) {
        const params: z.infer<typeof webListMessagesSchema> = {
          sessionId: currentSession,
          page: 1,
          limit: 100,
          includeDeleted: false,
          sortOrder: 'asc',
        };
        const response = await listMessages(JSON.stringify(params));

        if (!response.success || !response.data) {
          throw new Error(response.error || 'Failed to load messages');
        }

        set({
          messages: response.data.messages,
        });
      }

      set({ isInitializing: false, status: 'idle' });
    } catch (error) {
      console.error('Error initializing chat:', error);
      set({
        isInitializing: false,
        error: error instanceof Error ? error.message : String(error),
        status: 'error',
      });
    }
  },

  createSession: () => {
    const now = new Date();
    const newSession: Session = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      modelId: 'gpt-4',
      createdAt: now,
      updatedAt: now,
      metadata: {
        lastMessage: '',
      },
    };

    set(state => ({
      sessions: [newSession, ...state.sessions],
      currentSession: newSession.id,
      messages: [], // Clear messages for new session
    }));
  },

  setCurrentSession: (sessionId: string) => {
    set({ currentSession: sessionId, messages: [] }); // Clear messages when switching sessions
    // Load messages for this session
    get().initialize();
  },

  clearError: () => {
    set({ error: null });
  },
}));
