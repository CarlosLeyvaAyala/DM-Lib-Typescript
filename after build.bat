:: This script is needed because it seems the build process locks files and it doesn't
:: let move them until after the execution window is closed.
:: This opens another execution window.
dotnet fsi ".\scripts\after build.fsx"
