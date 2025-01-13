import { NextRequest, NextResponse } from 'next/server';
import {
  createSession,
  getSessions,
  updateSession,
  deleteSession,
  batchDeleteSessions,
} from '@/lib/db/chat';
import { MODEL_IDS } from '@danky/schema';

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const modelId = searchParams.get('modelId');

  if (!modelId || !MODEL_IDS.includes(modelId as (typeof MODEL_IDS)[number])) {
    return Response.json({ error: 'Invalid model ID' }, { status: 400 });
  }

  const session = await createSession(
    {
      title: 'New Chat',
      modelId: modelId as (typeof MODEL_IDS)[number],
      description: 'Created via API',
    },
    'temp-user-id'
  );

  return Response.json(session);
}

export async function GET(request: NextRequest) {
  const sessions = await getSessions(
    {
      limit: 10,
      page: 1,
      includeDeleted: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    },
    'temp-user-id'
  );
  return Response.json(sessions);
}

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const session = await updateSession(body, 'temp-user-id');
  return Response.json(session);
}

export async function DELETE(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const ids = searchParams.getAll('id');
  const permanent = searchParams.get('permanent') === 'true';

  if (ids.length > 1) {
    const result = await batchDeleteSessions(
      {
        ids,
        permanent,
      },
      'temp-user-id'
    );

    return NextResponse.json(result);
  }

  const result = await deleteSession(
    {
      id: ids[0],
      permanent,
    },
    'temp-user-id'
  );

  return NextResponse.json(result);
}
