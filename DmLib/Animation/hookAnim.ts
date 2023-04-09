import { hooks, once } from "skyrimPlatform"

/** Adds a hook to react to some animation event.
 * @param  {string} animName Name of the animation to react to.
 * @param  {()=>void} callback Function to call when animation is played.
 * @param  {number | undefined} minFormId Minimum FormId of actors to react to.
 * @param  {number | undefined} maxFormId Maximum FormId of actors to react to.
 */
export function hookAnim(
  animName: string,
  callback: () => void,
  minFormId: number | undefined,
  maxFormId: number | undefined
) {
  hooks.sendAnimationEvent.add(
    {
      enter(_) {},
      leave(c) {
        if (c.animationSucceeded) once("update", () => callback())
      },
    },
    minFormId,
    maxFormId,
    animName
  )
}
