import { Utility } from "skyrimPlatform"
import * as Log from "./Log"

/** @experimental
 * Doesn't work right now. Maybe I need to use promises and whatnot.
 *
 * Measures the time it takes a function to execute and logs that.
 *
 * @remarks
 * `Utility.getCurrentRealTime()` seems to be returning the same value for both
 * times the function starts and ends.\
 * I suspect this is because most functions in Skyrim Platform don't wait for the others to end.
 *
 * @param f - Function to measure.
 * @param Log - Function used for logging the time. You can supply a logging level-aware function.
 */
export function Benchmark(f: () => void, Log: Log.LoggingFunction): () => void {
  return () => {
    const t1 = Utility.getCurrentRealTime()
    Log(`${f.name} start time: ${t1}`)

    const ff = new Promise<number>((resolve, _) => {
      f()
      resolve(Utility.getCurrentRealTime())
    })

    ff.then((t2) => {
      Log(`${f.name} end time: ${t2}`)
      Log(`Execution time for ${f.name}: ${t2 - t1}`)
    })
  }
}
