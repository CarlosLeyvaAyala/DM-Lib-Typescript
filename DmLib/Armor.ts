import { Armor } from "skyrimPlatform"

/** Get all keywords from an armor. */
export function getKeywords(a: Armor) {
    const r = new Array<number>()
    const n = a.getNumKeywords()

    for (let i = 0; i < n; i++) {
        const k = a.getNthKeyword(i);
        if (!k) continue
        const id = k.getFormID()
        r.push(id)
    }
    return r
}

// ███████╗██╗  ██╗██████╗ ███████╗██████╗ ██╗███╗   ███╗███████╗███╗   ██╗████████╗ █████╗ ██╗     
// ██╔════╝╚██╗██╔╝██╔══██╗██╔════╝██╔══██╗██║████╗ ████║██╔════╝████╗  ██║╚══██╔══╝██╔══██╗██║     
// █████╗   ╚███╔╝ ██████╔╝█████╗  ██████╔╝██║██╔████╔██║█████╗  ██╔██╗ ██║   ██║   ███████║██║     
// ██╔══╝   ██╔██╗ ██╔═══╝ ██╔══╝  ██╔══██╗██║██║╚██╔╝██║██╔══╝  ██║╚██╗██║   ██║   ██╔══██║██║     
// ███████╗██╔╝ ██╗██║     ███████╗██║  ██║██║██║ ╚═╝ ██║███████╗██║ ╚████║   ██║   ██║  ██║███████╗
// ╚══════╝╚═╝  ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝╚═╝╚═╝     ╚═╝╚══════╝╚═╝  ╚═══╝   ╚═╝   ╚═╝  ╚═╝╚══════╝

/** Extend Armor */
declare module 'skyrimPlatform' {
    interface Armor {
        /** Gets all the keywords from the armor.
         * @experimental
         */
        getKeywords(): number[]
    }
}

Armor.prototype.getKeywords = function (): number[] {
    return getKeywords(this)
}
