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
