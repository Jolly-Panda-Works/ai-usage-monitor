# Code signing

Windows builds are **not code-signed yet**, so SmartScreen may show "Windows protected your PC". Click **More info → Run anyway**.

## Verify your download
Every release includes `SHA256SUMS.txt`. In PowerShell:
```
Get-FileHash .\AI-Usage-Monitor-Setup-<version>.exe -Algorithm SHA256
```
and compare with the matching line. You can also build the app yourself from source (see README) — the GitHub Actions workflow is public.

## Plan
Apply for a free/low-cost open-source signing certificate, or distribute through the Microsoft Store, to remove the warning.
