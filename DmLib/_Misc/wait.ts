import { Utility } from "skyrimPlatform"

/**
 * Waits some time, then does something.
 * @remark
 * This function was made to avoid all the clutter that requires to call an `async` function.
 *
 * @param time Time to wait (seconds).
 * @param DoSomething What to do after `time` has passed.
 */
export function wait(time: number, DoSomething: () => void) {
  const F = async () => {
    await Utility.wait(time)
    DoSomething()
  }
  F()
}
