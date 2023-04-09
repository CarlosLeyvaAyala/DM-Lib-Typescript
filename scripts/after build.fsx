#load "Ops.fsx"

(**
    Removes Skyrim Platform compiled code and moves compiled library files base "dist" dir.
*)
open System.IO
open Ops

let distDir = Path.Combine(sourceDir, @"dist")

Directory.GetFiles(distDir, "*skyrimplatform*")
|> Array.iter File.Delete

// Move files to dist
let excessDir = Path.Combine(distDir, "DmLib")

Directory.GetDirectories(excessDir)
|> Array.Parallel.map (fun dir ->
    dir,
    dir
    |> Path.GetDirectoryName
    |> getRelativeDir "../"
    |> fun b -> Path.Combine(b, dir |> Path.GetFileName))
|> Array.iter (fun fn ->
    try
        Directory.Move fn
    with
    | e -> printfn "%s" e.Message)

Directory.GetFiles(excessDir)
|> Array.Parallel.map (fun dir ->
    dir,
    dir
    |> Path.GetDirectoryName
    |> getRelativeDir "../"
    |> fun b -> Path.Combine(b, dir |> Path.GetFileName))
|> Array.iter (fun fn ->
    try
        File.Move(fst fn, snd fn)
    with
    | e -> printfn "%s" e.Message)

try
    Directory.Delete(excessDir)
with
| e -> printfn "%s" e.Message
