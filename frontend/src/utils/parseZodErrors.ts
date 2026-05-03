import { z } from 'zod';

export const parseZodErrors = <T extends Record<string, unknown>>(
  result: z.ZodSafeParseError<T> | z.ZodSafeParseSuccess<T>
): Partial<Record<keyof T, string>> => {
  const errors: Partial<Record<keyof T, string>> = {};
  if (!result.success) {
    for (const issue of result.error.issues) {
      const f = issue.path[0] as keyof T;
      if (f && !errors[f]) errors[f] = issue.message;
    }
  }
  return errors;
};