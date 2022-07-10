/**
 * Generates a random unique identifier.
 * @returns A version 4 RFC 4122/DCE 1.1 UUID.
 */
export function uuidV4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Generates a random unique identifier.
 * @returns A version 4 RFC 4122/DCE 1.1 UUID.
 */
export const guid = uuidV4
