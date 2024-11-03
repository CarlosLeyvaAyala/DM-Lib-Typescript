/** Joins two maps, applying a function when keys collide.
 *
 * @param m1 First map.
 * @param m2 Second map.
 * @param OnExistingKey Function for solving collisions.
 * @returns
 */
export function JoinMaps<K, V>(
  m1: Map<K, V>,
  m2: Map<K, V> | null | undefined,
  OnExistingKey: (v1: V, v2: V, k?: K) => V
) {
  if (!m2) return m1
  const o = new Map<K, V>(m1)
  m2.forEach((v2, k) => {
    if (o.has(k)) o.set(k, OnExistingKey(o.get(k) as V, v2, k))
    else o.set(k, v2)
  })
  return o
}

/** Joins two maps, applying a function when keys collide.
 *
 * @param m1 First map.
 * @param m2 Second map.
 * @param OnExistingKey Function for solving collisions.
 * @returns
 */
export const joinMaps = JoinMaps

/** Joins two maps, applying a function when keys collide.
 *
 * @param m1 First map.
 * @param m2 Second map.
 * @param OnExistingKey Function for solving collisions.
 * @returns
 */
export const join = JoinMaps

export function mapToArray<K, V>(m1: Map<K, V>) {
  const r: [K, V][] = []
  for (const k of m1) r.push(k)
  return r
}

export const toArray = mapToArray

/** Extend set */
declare global {
  interface Map<K, V> {
    filter(predicate: (value: V, key: K) => boolean): Map<K, V>
    map<K, V, V2>(mapper: (value: V, key: K) => V2): Map<K, V2>
    toArray(): [K, V][]
  }
}

Map.prototype.filter = function <K, V>(predicate: (value: V, key: K) => boolean) {
  const r = new Map<K, V>()
  this.forEach((v, k) => { if (predicate(v, k)) r.set(k, v) })
  return r
}

Map.prototype.toArray = function () {
  return mapToArray(this)
}

Map.prototype.map = function <K, V, V2>(mapper: (value: V, key: K) => V2) {
  const a: [K, V2][] = []
  const r = new Map<K, V2>()
  this.forEach((v, k) => a.push([k, mapper(v, k)]))
  a.iter(([k, v]) => r.set(k, v))
  return r
}
