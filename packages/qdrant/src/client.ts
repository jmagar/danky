import { QdrantClient } from '@qdrant/js-client-rest';
import { env } from './env';
import { createLogger } from '@danky/logger';

const logger = createLogger('qdrant');

export const qdrant = new QdrantClient({
  url: env.QDRANT_URL,
  timeout: 5000,
});

// Helper for creating collections
export async function ensureCollection(name: string, dimension: number) {
  try {
    await qdrant.getCollection(name);
    logger.info({ collection: name }, 'Collection exists');
  } catch (error) {
    await qdrant.createCollection(name, {
      vectors: {
        size: dimension,
        distance: 'Cosine',
      },
    });
    logger.info({ collection: name }, 'Created collection');
  }
}

// Helper for upserting points
export async function upsertVectors(
  collection: string,
  points: Array<{
    id: string;
    vector: number[];
    payload?: Record<string, unknown>;
  }>
) {
  try {
    await qdrant.upsert(collection, {
      points: points.map(p => ({
        id: p.id,
        vector: p.vector,
        payload: p.payload,
      })),
    });
    logger.info({ collection, count: points.length }, 'Successfully upserted vectors');
  } catch (error) {
    logger.error({ error, collection, count: points.length }, 'Failed to upsert vectors');
    throw error;
  }
}
