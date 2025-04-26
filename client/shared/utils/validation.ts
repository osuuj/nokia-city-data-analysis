import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

/**
 * Validates request body against a Zod schema
 * @param req NextRequest object
 * @param schema Zod schema to validate against
 * @returns Parsed data or error response
 */
export async function validateBody<T>(
  req: NextRequest,
  schema: z.Schema<T>,
): Promise<{ success: true; data: T } | { success: false; error: NextResponse }> {
  try {
    const body = await req.json();
    const data = schema.parse(body);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Validation failed',
            details: error.errors,
          },
          { status: 400 },
        ),
      };
    }
    return {
      success: false,
      error: NextResponse.json({ error: 'Invalid request body' }, { status: 400 }),
    };
  }
}

/**
 * Validates query parameters against a Zod schema
 * @param req NextRequest object
 * @param schema Zod schema to validate against
 * @returns Parsed data or error response
 */
export function validateQuery<T>(
  req: NextRequest,
  schema: z.Schema<T>,
): { success: true; data: T } | { success: false; error: NextResponse } {
  try {
    const url = new URL(req.url);
    const params = Object.fromEntries(url.searchParams);
    const data = schema.parse(params);
    return { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: NextResponse.json(
          {
            error: 'Invalid query parameters',
            details: error.errors,
          },
          { status: 400 },
        ),
      };
    }
    return {
      success: false,
      error: NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 }),
    };
  }
}

/**
 * Common validation schemas
 */
export const schemas = {
  pagination: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? Number.parseInt(val) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? Number.parseInt(val) : 10)),
  }),

  cityFilter: z.object({
    city: z.string().min(1),
  }),

  industryFilter: z.object({
    industry: z.string().min(1),
  }),

  companyCreate: z.object({
    name: z.string().min(1),
    industry: z.string().min(1),
    city: z.string().min(1),
    description: z.string().optional(),
    website: z.string().url().optional(),
  }),
};
