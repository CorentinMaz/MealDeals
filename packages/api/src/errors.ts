import type { ErrorCode, MessageParams } from "./types";

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

export function getErrorMessage(error: unknown, fallbackCode: ErrorCode): string {
  const parsed = parseAppError(error);
  if (parsed) {
    return parsed.code;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackCode;
}
