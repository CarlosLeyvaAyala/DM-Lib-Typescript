type ErrorWithMessage = {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  )
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

/**
 * Returns the string from an error.
 * @param error Error comming from a catch statement.
 * @returns Error string.
 * @example
 * ```
 * try {
 *   throw new Error('Oh no!')
 * } catch (error) {
 *   printConsole(getErrorMsg(error))
 * }
 * ```
 * @privateRemarks
 * Code got from
 * https://kentcdodds.com/blog/get-a-catch-block-error-message-with-typescript
 */
export function getErrorMsg(error: unknown) {
  return toErrorWithMessage(error).message
}
