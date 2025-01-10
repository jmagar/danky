import { z } from 'zod';

// Base response schema for API endpoints
export const baseResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  error: z.string().optional(),
});

// Base pagination schema
export const paginationSchema = z.object({
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
  totalPages: z.number().int().positive().optional(),
  totalItems: z.number().int().nonnegative().optional(),
});

// Base timestamp fields
export const timestampFields = {
  createdAt: z.date(),
  updatedAt: z.date(),
};

// Base ID field
export const idField = {
  id: z.string().uuid(),
};

// Base soft delete field
export const softDeleteField = {
  deletedAt: z.date().nullable(),
}; 