open System.IO
open System.Text.RegularExpressions

let (|Regex|_|) pattern input =
    let ms = Regex.Matches(input, pattern)
    printfn "*********** count %d" ms.Count
    let l = [ for m in ms -> List.tail [ for g in m.Groups -> g.Value ] ]
    printfn "%A" l

    let rr =
        match l with
        | [] -> None
        | r -> Some r

    printfn "%A" rr
    rr

let lst =
    Directory.GetFiles(__SOURCE_DIRECTORY__, "*.ts")
    |> Array.Parallel.map (fun fn ->
        let contents = File.ReadAllText fn

        let rx pattern =
            let ms = Regex.Matches(contents, pattern)

            [ for m in ms -> List.tail [ for g in m.Groups -> g.Value ] ]
            |> List.collect id
            |> List.map (fun s -> s.ToLower())

        let declared =
            rx @"export function (\w+)\("
            |> List.append (rx @"export const (\w+) = \(")
            |> List.sort
            |> Set.ofList

        let inDir =
            Path.Combine(__SOURCE_DIRECTORY__, Path.GetFileNameWithoutExtension fn)
            |> Directory.GetFiles
            |> Array.map Path.GetFileNameWithoutExtension
            |> Array.map (fun s -> s.ToLower())
            |> Set.ofArray

        let shared = Set.intersect declared inDir
        let all = Set.union declared inDir

        fn, Set.difference inDir declared)
    |> Array.map (fun (fn, missing) ->
        $"Missing on {Path.GetFileNameWithoutExtension fn}\n"
        + (missing
           |> Set.fold (fun acc s -> acc + $"    - {s}\n") ""))

File.WriteAllLines(Path.Combine(__SOURCE_DIRECTORY__, "__missing.txt"), lst)
