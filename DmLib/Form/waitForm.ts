import { Form, Utility } from "skyrimPlatform"
import { preserveForm } from "preserve"

export function waitForm(
  f: Form,
  time: number,
  DoSomething: (act: Form) => void
) {
  const Frm = preserveForm(f)
  const F = async () => {
    await Utility.wait(time)
    const frm = Frm()
    if (!frm) return
    DoSomething(frm)
  }
  F()
}
