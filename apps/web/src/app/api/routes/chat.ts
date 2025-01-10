import { NextRequest } from 'next/server';
import {
  createChatSession,
  listChatSessions,
  updateChatSession,
  deleteChatSession,
  batchDeleteChatSessions,
  batchRestoreChatSessions,
  batchArchiveChatSessions,
  batchUpdateChatSessions,
  batchDeleteChatMessages,
  batchRestoreChatMessages,
  batchCreateChatMessages,
} from '../actions/chat';

// Main route handlers
export async function POST(request: NextRequest) {
  const body = await request.json();
  return createChatSession(body);
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '50', 10);
  const search = searchParams.get('search') || undefined;

  return listChatSessions({ page, limit, search });
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  return updateChatSession(body);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return new Response('Missing session ID', { status: 400 });
  }

  return deleteChatSession({ id });
}

// Batch operations route handlers
export const batch = {
  async DELETE(request: NextRequest) {
    const body = await request.json();
    return batchDeleteChatSessions(body);
  },

  async POST(request: NextRequest) {
    const body = await request.json();
    const action = request.headers.get('x-batch-action');

    switch (action) {
      case 'restore':
        return batchRestoreChatSessions(body);
      case 'archive':
        return batchArchiveChatSessions(body);
      case 'update':
        return batchUpdateChatSessions(body);
      default:
        return new Response('Invalid batch action', { status: 400 });
    }
  }
};

// Batch message operations route handlers
export const messages = {
  async DELETE(request: NextRequest) {
    const body = await request.json();
    return batchDeleteChatMessages(body);
  },

  async POST(request: NextRequest) {
    const body = await request.json();
    const action = request.headers.get('x-batch-action');

    switch (action) {
      case 'restore':
        return batchRestoreChatMessages(body);
      case 'create':
        return batchCreateChatMessages(body);
      default:
        return new Response('Invalid batch action', { status: 400 });
    }
  }
};
