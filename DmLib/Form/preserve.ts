import { Actor, Form, Game } from "skyrimPlatform"

export function preserveForm(frm: Form | null) {
  if (!frm) return () => null
  const id = frm.getFormID()
  return () => Game.getFormEx(id)
}

export function preserveActor(a: Actor | null) {
  const f = preserveForm(a)
  return () => Actor.from(f())
}
