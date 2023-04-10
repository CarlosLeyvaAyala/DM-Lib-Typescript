/** Joins two maps, applying a function when keys collide.
 *
 * @param m1 First map.
 * @param m2 Second map.
 * @param OnExistingKey Function for solving collisions.
 * @returns
 */

export function joinMaps<K, V>(
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
