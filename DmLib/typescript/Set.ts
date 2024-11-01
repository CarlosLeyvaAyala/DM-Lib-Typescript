export { }

/** Extend set */
declare global {
    interface Set<T> {
        toArray(): Array<T>
    }
}

Set.prototype.toArray = function <T>() {
    let r = new Array<T>()
    for (let x of this) r.push(x)
    return r
}