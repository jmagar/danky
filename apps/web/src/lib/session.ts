import { cookies } from 'next/headers';
import { UnauthorizedError } from './errors';
import { logger } from '@danky/logger';

// Session types
interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  metadata?: Record<string, unknown>;
}

interface Session {
  user: User;
  expiresAt: Date;
  metadata?: Record<string, unknown>;
}

// Session configuration
const SESSION_COOKIE = 'auth_session';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

// Session store (replace with Redis in production)
const sessions = new Map<string, Session>();

// Helper to generate session ID
function generateSessionId(): string {
  return crypto.randomUUID();
}

// Helper to get current timestamp
function getCurrentTimestamp(): Date {
  return new Date();
}

// Helper to check if session is expired
function isSessionExpired(session: Session): boolean {
  return getCurrentTimestamp() > session.expiresAt;
}

// Helper to create session
export async function createSession(user: User): Promise<string> {
  const sessionId = generateSessionId();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  sessions.set(sessionId, {
    user,
    expiresAt,
    metadata: {
      createdAt: getCurrentTimestamp(),
      lastActive: getCurrentTimestamp(),
    },
  });
  
  // Set session cookie
  cookies().set(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });
  
  return sessionId;
}

// Helper to get session
export async function getSession(): Promise<Session> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  
  if (!sessionId) {
    throw new UnauthorizedError('No session found');
  }
  
  const session = sessions.get(sessionId);
  
  if (!session) {
    throw new UnauthorizedError('Invalid session');
  }
  
  if (isSessionExpired(session)) {
    sessions.delete(sessionId);
    throw new UnauthorizedError('Session expired');
  }
  
  // Update last active timestamp
  session.metadata = {
    ...session.metadata,
    lastActive: getCurrentTimestamp(),
  };
  
  return session;
}

// Helper to end session
export async function endSession(): Promise<void> {
  const sessionId = cookies().get(SESSION_COOKIE)?.value;
  
  if (sessionId) {
    sessions.delete(sessionId);
    cookies().delete(SESSION_COOKIE);
  }
}

// Helper to get current user
export async function getCurrentUser(): Promise<User> {
  try {
    const session = await getSession();
    return session.user;
  } catch (error) {
    throw new UnauthorizedError('Not authenticated');
  }
}

// Helper to require authentication
export async function withUser<T>(
  handler: (user: User) => Promise<T>
): Promise<T> {
  try {
    const user = await getCurrentUser();
    return handler(user);
  } catch (error) {
    logger.error({
      operation: 'withUser',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

// Helper to require admin role
export async function withAdmin<T>(
  handler: (user: User) => Promise<T>
): Promise<T> {
  return withUser(async (user) => {
    if (user.role !== 'admin') {
      throw new UnauthorizedError('Admin access required');
    }
    return handler(user);
  });
}

// Helper to check if user has access to a resource
export async function checkResourceAccess(
  resourceUserId: string,
  allowAdmin: boolean = true
): Promise<void> {
  const user = await getCurrentUser();
  
  if (
    user.id !== resourceUserId &&
    (!allowAdmin || user.role !== 'admin')
  ) {
    throw new UnauthorizedError('Access denied');
  }
}

// Helper to refresh session
export async function refreshSession(): Promise<void> {
  const session = await getSession();
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  
  session.expiresAt = expiresAt;
  session.metadata = {
    ...session.metadata,
    lastActive: getCurrentTimestamp(),
  };
  
  // Update session cookie
  cookies().set(SESSION_COOKIE, cookies().get(SESSION_COOKIE)!.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: expiresAt,
  });
}

// Helper to get all active sessions for a user
export async function getUserSessions(userId: string): Promise<Session[]> {
  return Array.from(sessions.values()).filter(
    session => session.user.id === userId && !isSessionExpired(session)
  );
}

// Helper to end all sessions for a user
export async function endUserSessions(userId: string): Promise<void> {
  for (const [sessionId, session] of sessions.entries()) {
    if (session.user.id === userId) {
      sessions.delete(sessionId);
    }
  }
}

// Export types
export type { User, Session }; 