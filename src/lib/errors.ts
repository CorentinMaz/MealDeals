import type { ErrorCode, MessageParams } from "@/lib/i18n/types";
import type { TranslateFn } from "@/lib/i18n/translate";

const APP_ERROR_PREFIX = "APP_ERROR:";

export function createAppError(
  code: ErrorCode,
  params?: MessageParams,
): Error {
  const error = new Error(
    `${APP_ERROR_PREFIX}${code}:${JSON.stringify(params ?? {})}`,
  );
  error.name = "AppError";
  return error;
}

export function parseAppError(
  error: unknown,
): { code: ErrorCode; params: MessageParams } | null {
  if (!(error instanceof Error) || !error.message.startsWith(APP_ERROR_PREFIX)) {
    return null;
  }

  const rest = error.message.slice(APP_ERROR_PREFIX.length);
  const colonIndex = rest.indexOf(":");

  if (colonIndex === -1) {
    return null;
  }

  const code = rest.slice(0, colonIndex) as ErrorCode;
  const paramsJson = rest.slice(colonIndex + 1);

  try {
    const params = JSON.parse(paramsJson) as MessageParams;
    return { code, params };
  } catch {
    return { code, params: {} };
  }
}

export function getErrorMessage(
  error: unknown,
  t: TranslateFn,
  fallbackCode: ErrorCode,
): string {
  const parsed = parseAppError(error);
  if (parsed) {
    return t(`errors.${parsed.code}`, parsed.params);
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return t(`errors.${fallbackCode}`);
}

export function formatAppErrorMessage(
  code: ErrorCode,
  t: TranslateFn,
  params?: MessageParams,
): string {
  return t(`errors.${code}`, params);
}
