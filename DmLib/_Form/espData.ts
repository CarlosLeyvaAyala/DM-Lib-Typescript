/** In what space is the mod loaded in? */
export const enum ModType {
  esp,
  esl,
  unknown,
}

/** Info a `Form` gets about its esp. */
export interface FormEspInfo {
  name: string
  type: ModType
}
