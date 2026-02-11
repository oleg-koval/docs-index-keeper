#!/usr/bin/env bash
# Set NPM_TOKEN in GitHub repo secrets for CI publish.
#
# With 2FA passkey (1Password etc.): use --from-browser
#   1. Create token in browser (passkey works there): https://www.npmjs.com/settings/~/tokens
#   2. Run this script; paste the token when prompted.
#
# With TOTP (authenticator app): use --otp=CODE
# Usage: ./set-npm-token-secret.sh [--from-browser|--otp=123456] [owner/repo]
set -euo pipefail
REPO="oleg-koval/docs-index-keeper"
OTP=""
FROM_BROWSER=""
for arg in "$@"; do
  if [[ "$arg" == --otp=* ]]; then OTP="${arg#--otp=}"; elif [[ "$arg" == --from-browser ]]; then FROM_BROWSER=1; elif [[ "$arg" != --* ]]; then REPO="$arg"; fi
done
OUT="/tmp/npm-token-$$.txt"
cleanup() { rm -f "$OUT"; }
trap cleanup EXIT

if [[ -n "$FROM_BROWSER" ]]; then
  echo "==> Create a token in the browser (use 1Password passkey there):"
  echo "    https://www.npmjs.com/settings/~/tokens"
  echo "    Add token → Granular → Packages and scopes: Read and write"
  echo ""
  echo "==> Paste the token below (then Ctrl+D), or we'll prompt for it..."
  gh secret set NPM_TOKEN --repo "$REPO"
  echo "Done. CI can now publish to npm."
  exit 0
fi

echo "==> Creating npm token (you will be prompted for npm password)..."
if [[ -n "$OTP" ]]; then
  npm token create "GitHub Actions docs-index-keeper" --otp="$OTP" 2>&1 | tee "$OUT"
else
  npm token create "GitHub Actions docs-index-keeper" 2>&1 | tee "$OUT"
fi
echo ""
TOKEN=$(grep -oE 'npm_[a-zA-Z0-9_-]{20,}' "$OUT" | head -1)
if [[ -z "$TOKEN" ]]; then
  echo "Could not parse token. Use --from-browser and create token at:"
  echo "  https://www.npmjs.com/settings/~/tokens"
  exit 1
fi
echo "==> Setting NPM_TOKEN secret for ${REPO}..."
gh secret set NPM_TOKEN --repo "$REPO" --body "$TOKEN"
echo "Done. CI can now publish to npm."
