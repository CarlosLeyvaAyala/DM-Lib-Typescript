# Hotkeys

Here you will find all hotkey values you can use in a configuration file and instructions on how to use them.

You can write values either by name (enclosed between `"`) or number.

```json
// By name. Same as 207.
"hotkey": "End"

// By number. Same as "End".
"hotkey": 207
```

***Hotkey names are case sensitive***.\
This means `"CapsLock"` is a valid value, while `"capsLock"`, `"capslock"`, `"CaPsLoCk"`... are not.

# Modifiers
When writing a hotkey by name (the preferred way) it's possible to add modifiers to a hotkey.

These are the three possible modifiers:

| Modifier  |
|-----------|
| `"Alt"`   |
| `"Ctrl"`  |
| `"Shift"` |

***Modifiers are also case sensitive***.

```json
// Modifiers ARE ONLY SEPARATED BY AN SPACE. Never use "+".
"hotkey1": "Shift E",
"hotkey2": "Alt E",
"hotkey3": "Ctrl E"
"hotkey4": "E"
```

As you just saw, you can assign the same key to many different functions by using a modifier.

When doing so, expect `hotkey4` to be run **only and only** when `E` is pressed alone.

Modifiers are keys that have both left and right key (right shift, left shift, right control...). \
It doesn't matter which of both you press, since both are the same for this library.

## Modifier combinations

You can also combine many modifiers to define a hotkey.

This effectively raises the possible number of hotkeys to... what??? **At least 400 possible combinations**, so you won't ever get short of hotkeys to use.

Just look at all possibilities **for just one key** (`"F1"`).

```json
"hotkey1": "F1",
"hotkey2": "Alt F1",
"hotkey3": "Ctrl F1",
"hotkey4": "Shift F1",
"hotkey5": "Alt Shift F1",
"hotkey6": "Alt Ctrl F1",
"hotkey7": "Ctrl Shift F1",
"hotkey8": "Alt Ctrl Shift F1"
```

## Nuances

***Modifiers are expected to be used only in combination with other keys***.

This means all of these are invalid:

```json
"error1": "Shift",
"error2": "Alt",
"error3": "Ctrl"
```

If for some reason you REAAAAALLY want to use one of those keys by themselves, you must define them as a number.

```json
"hotkey": 56  // Left alt
"hotkey": 29  // Left ctrl
"hotkey": 42  // Left shift
"hotkey": 184 // Right alt
"hotkey": 157 // Right ctrl
"hotkey": 54  // Right shift
```

Still, that's not recommended to do, since some mods like Easy Containers expect you to use a modifier to invert its operations.

# Possible values tables

| As name               | As number |
|-----------------------|-----------|
| `"A"`                 | 30        |
| `"Apostrophe"`        | 40        |
| `"B"`                 | 48        |
| `"BackSlash"`         | 43        |
| `"Backspace"`         | 14        |
| `"C"`                 | 46        |
| `"CapsLock"`          | 58        |
| `"Comma"`             | 51        |
| `"Console"`           | 41        |
| `"D"`                 | 32        |
| `"Delete"`            | 211       |
| `"DownArrow"`         | 208       |
| `"E"`                 | 18        |
| `"End"`               | 207       |
| `"Enter"`             | 28        |
| `"Equals"`            | 13        |
| `"Escape"`            | 1         |
| `"F"`                 | 33        |
| `"F1"`                | 59        |
| `"F10"`               | 68        |
| `"F11"`               | 87        |
| `"F12"`               | 88        |
| `"F2"`                | 60        |
| `"F3"`                | 61        |
| `"F4"`                | 62        |
| `"F5"`                | 63        |
| `"F6"`                | 64        |
| `"F7"`                | 65        |
| `"F8"`                | 66        |
| `"F9"`                | 67        |
| `"ForwardSlash"`      | 53        |
| `"G"`                 | 34        |
| `"H"`                 | 35        |
| `"Home"`              | 199       |
| `"I"`                 | 23        |
| `"Insert"`            | 210       |
| `"J"`                 | 36        |
| `"K"`                 | 37        |
| `"L"`                 | 38        |
| `"LeftArrow"`         | 203       |
| `"LeftBracket"`       | 26        |
| `"LeftMouseButton"`   | 256       |
| `"M"`                 | 50        |
| `"MiddleMouseButton"` | 258       |
| `"Minus"`             | 12        |
| `"MouseButton3"`      | 259       |
| `"MouseButton4"`      | 260       |
| `"MouseButton5"`      | 261       |
| `"MouseButton6"`      | 262       |
| `"MouseButton7"`      | 263       |
| `"MouseWheelDown"`    | 265       |
| `"MouseWheelUp"`      | 264       |
| `"N"`                 | 49        |
| `"N0"`                | 11        |
| `"N1"`                | 2         |
| `"N2"`                | 3         |
| `"N3"`                | 4         |
| `"N4"`                | 5         |
| `"N5"`                | 6         |
| `"N6"`                | 7         |
| `"N7"`                | 8         |
| `"N8"`                | 9         |
| `"N9"`                | 10        |
| `"None"`              | 0         |
| `"Num0"`              | 82        |
| `"Num1"`              | 79        |
| `"Num2"`              | 80        |
| `"Num3"`              | 81        |
| `"Num4"`              | 75        |
| `"Num5"`              | 76        |
| `"Num6"`              | 77        |
| `"Num7"`              | 71        |
| `"Num8"`              | 72        |
| `"Num9"`              | 73        |
| `"NumDot"`            | 83        |
| `"NumEnter"`          | 156       |
| `"NumLock"`           | 69        |
| `"NumMinus"`          | 74        |
| `"NumMult"`           | 55        |
| `"NumPlus"`           | 78        |
| `"NumSlash"`          | 181       |
| `"O"`                 | 24        |
| `"P"`                 | 25        |
| `"Pause"`             | 197       |
| `"Period"`            | 52        |
| `"PgDown"`            | 209       |
| `"PgUp"`              | 201       |
| `"Q"`                 | 16        |
| `"R"`                 | 19        |
| `"RightArrow"`        | 205       |
| `"RightBracket"`      | 27        |
| `"RightMouseButton"`  | 257       |
| `"S"`                 | 31        |
| `"ScrollLock"`        | 70        |
| `"Semicolon"`         | 39        |
| `"Spacebar"`          | 57        |
| `"SysRqPtrScr"`       | 183       |
| `"T"`                 | 20        |
| `"Tab"`               | 15        |
| `"U"`                 | 22        |
| `"UpArrow"`           | 200       |
| `"V"`                 | 47        |
| `"W"`                 | 17        |
| `"X"`                 | 45        |
| `"Y"`                 | 21        |
| `"Z"`                 | 44        |

Same list, sorted by number:

| As name               | As number |
|-----------------------|-----------|
| `"None"`              | 0         |
| `"Escape"`            | 1         |
| `"N1"`                | 2         |
| `"N2"`                | 3         |
| `"N3"`                | 4         |
| `"N4"`                | 5         |
| `"N5"`                | 6         |
| `"N6"`                | 7         |
| `"N7"`                | 8         |
| `"N8"`                | 9         |
| `"N9"`                | 10        |
| `"N0"`                | 11        |
| `"Minus"`             | 12        |
| `"Equals"`            | 13        |
| `"Backspace"`         | 14        |
| `"Tab"`               | 15        |
| `"Q"`                 | 16        |
| `"W"`                 | 17        |
| `"E"`                 | 18        |
| `"R"`                 | 19        |
| `"T"`                 | 20        |
| `"Y"`                 | 21        |
| `"U"`                 | 22        |
| `"I"`                 | 23        |
| `"O"`                 | 24        |
| `"P"`                 | 25        |
| `"LeftBracket"`       | 26        |
| `"RightBracket"`      | 27        |
| `"Enter"`             | 28        |
| `"A"`                 | 30        |
| `"S"`                 | 31        |
| `"D"`                 | 32        |
| `"F"`                 | 33        |
| `"G"`                 | 34        |
| `"H"`                 | 35        |
| `"J"`                 | 36        |
| `"K"`                 | 37        |
| `"L"`                 | 38        |
| `"Semicolon"`         | 39        |
| `"Apostrophe"`        | 40        |
| `"Console"`           | 41        |
| `"BackSlash"`         | 43        |
| `"Z"`                 | 44        |
| `"X"`                 | 45        |
| `"C"`                 | 46        |
| `"V"`                 | 47        |
| `"B"`                 | 48        |
| `"N"`                 | 49        |
| `"M"`                 | 50        |
| `"Comma"`             | 51        |
| `"Period"`            | 52        |
| `"ForwardSlash"`      | 53        |
| `"NumMult"`           | 55        |
| `"Spacebar"`          | 57        |
| `"CapsLock"`          | 58        |
| `"F1"`                | 59        |
| `"F2"`                | 60        |
| `"F3"`                | 61        |
| `"F4"`                | 62        |
| `"F5"`                | 63        |
| `"F6"`                | 64        |
| `"F7"`                | 65        |
| `"F8"`                | 66        |
| `"F9"`                | 67        |
| `"F10"`               | 68        |
| `"NumLock"`           | 69        |
| `"ScrollLock"`        | 70        |
| `"Num7"`              | 71        |
| `"Num8"`              | 72        |
| `"Num9"`              | 73        |
| `"NumMinus"`          | 74        |
| `"Num4"`              | 75        |
| `"Num5"`              | 76        |
| `"Num6"`              | 77        |
| `"NumPlus"`           | 78        |
| `"Num1"`              | 79        |
| `"Num2"`              | 80        |
| `"Num3"`              | 81        |
| `"Num0"`              | 82        |
| `"NumDot"`            | 83        |
| `"F11"`               | 87        |
| `"F12"`               | 88        |
| `"NumEnter"`          | 156       |
| `"NumSlash"`          | 181       |
| `"SysRqPtrScr"`       | 183       |
| `"Pause"`             | 197       |
| `"Home"`              | 199       |
| `"UpArrow"`           | 200       |
| `"PgUp"`              | 201       |
| `"LeftArrow"`         | 203       |
| `"RightArrow"`        | 205       |
| `"End"`               | 207       |
| `"DownArrow"`         | 208       |
| `"PgDown"`            | 209       |
| `"Insert"`            | 210       |
| `"Delete"`            | 211       |
| `"LeftMouseButton"`   | 256       |
| `"RightMouseButton"`  | 257       |
| `"MiddleMouseButton"` | 258       |
| `"MouseButton3"`      | 259       |
| `"MouseButton4"`      | 260       |
| `"MouseButton5"`      | 261       |
| `"MouseButton6"`      | 262       |
| `"MouseButton7"`      | 263       |
| `"MouseWheelUp"`      | 264       |
| `"MouseWheelDown"`    | 265       |
