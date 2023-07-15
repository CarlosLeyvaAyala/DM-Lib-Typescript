(*
  Creates alternate declarations for functions.
*)

#r "nuget: TextCopy"

open System.Text.RegularExpressions
open System

type FunctionData = { comment: string; name: string }

let getData (content: string) =
    let getComment (fullFunctionDeclaration: string) =
        let endS = content.IndexOf(fullFunctionDeclaration) - 1
        let startS = content[ 1..endS ].LastIndexOf("/**")
        content[ startS..endS ].Trim()

    let ms =
        // Regex(@"(?s)(\/\*\*.*?\*\/\n\s+)export (?!const enum)(function|const) (\w+)")
        Regex(@"export (?!const enum)(function|const) (\w+)")
            .Matches(content)

    printfn "%d" ms.Count

    // [| for m in ms -> m.Groups[2].Value |]
    [| for m in ms ->
           { comment = getComment m.Groups[0].Value
             name = m.Groups[2].Value } |]

let banner =
    let t = "// ;> ALTERNATE DECLARATIONS"
    let h = "// ;> ".PadRight(t.Length, '=')
    $"{h}\n{t}\n{h}\n"

let content = TextCopy.ClipboardService.GetText()

content
|> getData
|> Array.Parallel.map (fun f ->
    let c = f.name[0]

    let s =
        match Char.IsUpper(c) with
        | true -> c.ToString().ToLower() + f.name[1..]
        | false -> c.ToString().ToUpper() + f.name[1..]

    $"{f.comment}\nexport const {s} = {f.name}\n")
|> Array.fold (fun acc s -> acc + "\n" + s) banner
|> TextCopy.ClipboardService.SetText
