# DM-Lib Typescript
Library for helping developing plugins for Skyrim Platform.

Functions are documented in source (with example usages) using [TSDoc][], so you will get all kind of hints when using [Visual Studio Code][].

# Usage
Drop the `DM-Lib` folder in the folder where `skyrimPlatform.ts` is located, then include it doing this:

```js
import * as D from "DM-Lib/Debug"
import { AvoidRapidFire, GetFormEsp } from "DM-Lib/Misc"

// Do something with those functions
```

# Purpose
Make it easier and cleaner to work with Skyrim.

Most of these functions were made to avoid repeating the same code over and over again.

Learning about [anonymous functions][] is a must.\
You can also learn how to use these functions by studying these plugins made by me:

- [Easy Containers][]
- [Auto Unequip ammo][AutoAmmo]

## Function categories

### Combinators
Useful [combinators][Javascript-Allonge].

Will make you look smarter than you actually are (I should know) and your code will be shorter and more arcane to profane viewers.

### Debug
Make debugging easier by logging values at diferent logging levels, logging while assigning values, testing bottlenecks, etc.

### Hotkeys
Don't waste time managing hotkey logic by yourself.\
Just tell the game what you want to do when a key is pressed/released/held.

### Iteration
Concentrate on what you want to do with Skyrim forms instead of writing the same old boring `while` loops over and over again.

### Math

Miscelaneous math functions.\
Interpolation, ranges...

### Misc
Functions I don't know yet where to put.

Many of them may change locations as I develop this library and add more functions.

Don't worry about me changing functions locations to break your code, though. Typescript makes it really easy to just get the real function from somewhere else, so you will never notice changes anyway.

### Time

Commodity functions for dealing with Skyrim time.

[TSDoc]: https://tsdoc.org/
[Visual Studio Code]: https://code.visualstudio.com/
[Javascript-Allonge]: https://leanpub.com/javascriptallongesix/read#leanpub-auto-making-data-out-of-functions
[anonymous functions]: https://dev.to/aumayeung/introduction-to-typescript-functions-anonymous-functions-and-more-2lif
[Easy Containers]: https://github.com/CarlosLeyvaAyala/Easy-Containers/blob/main/Platform/easy-containers/src/entry.ts
[AutoAmmo]: https://github.com/CarlosLeyvaAyala/auto-unequip-ammo
