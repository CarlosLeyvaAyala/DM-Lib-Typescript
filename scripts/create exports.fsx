#load "Ops.fsx"

open Ops
open System.IO

let srcDir = Path.Combine(sourceDir, "DmLib")

srcDir
|> Directory.GetDirectories
|> Array.Parallel.map (fun dir ->
    let d = Path.GetFileName dir

    $"{d}.ts",

    Directory.GetFiles(dir, "*.ts")
    |> Array.Parallel.map (fun fn -> $"export * from \"./{d}/{Path.GetFileNameWithoutExtension fn}\"")
    |> Array.fold (fun acc s -> acc + "\n" + s) ""
    |> fun s -> s.Trim())
|> Array.iter (fun (fn, contents) -> File.WriteAllText(Path.Combine(srcDir, fn), contents))
