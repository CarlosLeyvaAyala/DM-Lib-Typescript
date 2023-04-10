import { getErrorMsg } from "../Error/getErrorMsg"

/**
 * Tries to do something. Logs an error if an exception happens.
 * @param DoSomething Thing to do.
 * @param Logger Logger function.
 */
export function tryE(DoSomething: () => void, Logger: (msg: string) => void) {
  try {
    DoSomething()
  } catch (error) {
    Logger(getErrorMsg(error))
  }
}
