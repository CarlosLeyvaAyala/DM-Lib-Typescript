module Ops

open System.IO

let getRelativeDir relPath dir =
    Path.GetFullPath(Path.Combine(dir, relPath))

let sourceDir = getRelativeDir "../" __SOURCE_DIRECTORY__
