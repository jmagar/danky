declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DATABASE_URL: string;
    REDIS_URL: string;
    QDRANT_URL: string;
    OPENAI_API_KEY: string;
    ANTHROPIC_API_KEY: string;
    GROQ_API_KEY?: string;
    BRAVE_API_KEY?: string;
    LOG_LEVEL?: 'debug' | 'info' | 'warn' | 'error';
  }
}
