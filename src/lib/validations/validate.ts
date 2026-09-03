import { NextResponse } from 'next/server';
import { ZodSchema, ZodError } from 'zod';

export interface FieldIssue {
  field: string;
  issue: string;
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; response: NextResponse };

export function validateBody<T>(schema: ZodSchema<T>, body: unknown): ValidationResult<T> {
  const result = schema.safeParse(body);

  if (!result.success) {
    const details: FieldIssue[] = result.error.issues.map((err) => ({
      field: err.path.map(String).join('.'),
      issue: err.message,
    }));

    return {
      success: false,
      response: NextResponse.json(
        {
          error: {
            code: 'VALIDATION_FAILED',
            message: 'Validation failed',
            details,
          },
        },
        { status: 422 }
      ),
    };
  }

  return { success: true, data: result.data };
}
