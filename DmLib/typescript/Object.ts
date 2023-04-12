/** Iterates all entries in an object. */
export function iterateEntries<T>(
  o: { [key: string]: T },
  action: (key: string, v: T) => void
) {
  for (const [k, v] of Object.entries(o)) action(k, v)
}

/** Returns the object entries as an array of tuple `[key, value]`. */
export function entriesToArray<T>(o: { [key: string]: T }) {
  const r: [string, T][] = []
  iterateEntries(o, (k, v) => r.push([k, v]))
  return r
}
