#!/usr/bin/env bash
set -euo pipefail

if [[ "${OSTYPE:-}" != darwin* ]]; then
  echo "This helper supports macOS (darwin) only." >&2
  exit 1
fi

command -v brew >/dev/null 2>&1 || {
  echo "Homebrew is required. Install from https://brew.sh first." >&2
  exit 1
}

echo "[1/4] Installing dependencies (mkcert, nss)..."
brew list mkcert >/dev/null 2>&1 || brew install mkcert >/dev/null
brew list nss >/dev/null 2>&1 || brew install nss >/dev/null

echo "[2/4] Ensuring local CA is installed..."
mkcert -install >/dev/null || true

CERT_DIR="$HOME/.config/tomnap/certs"
mkdir -p "$CERT_DIR"

LAN_IP="$(ipconfig getifaddr en0 2>/dev/null || true)"
if [[ -z "$LAN_IP" ]]; then
  LAN_IP="$(ipconfig getifaddr en1 2>/dev/null || true)"
fi

HOST_SHORT="$(hostname -s)"
HOST_LOCAL="${HOST_SHORT}.local"

CERT_FILE="$CERT_DIR/cert.pem"
KEY_FILE="$CERT_DIR/key.pem"

if [[ ! -f "$CERT_FILE" || ! -f "$KEY_FILE" ]]; then
  echo "[3/4] Generating certificates..."
  if [[ -n "$LAN_IP" ]]; then
    mkcert -key-file "$KEY_FILE" -cert-file "$CERT_FILE" "$HOST_LOCAL" "$LAN_IP" localhost >/dev/null
  else
    mkcert -key-file "$KEY_FILE" -cert-file "$CERT_FILE" "$HOST_LOCAL" localhost >/dev/null
  fi
else
  echo "[3/4] Reusing existing certificates at $CERT_DIR"
fi

ROOT_CA_DIR="$(mkcert -CAROOT)"
echo "Root CA directory: $ROOT_CA_DIR"

TARGET_PORT=3000
HTTPS_PORT=3001

echo "[4/4] Starting HTTPS proxy https://$HOST_LOCAL:$HTTPS_PORT -> http://127.0.0.1:$TARGET_PORT"
echo "Certificates: $CERT_FILE | $KEY_FILE"

if command -v pnpm >/dev/null 2>&1; then
  CMD=(pnpm dlx local-ssl-proxy --source "$HTTPS_PORT" --target "$TARGET_PORT" --cert "$CERT_FILE" --key "$KEY_FILE")
else
  CMD=(npx --yes local-ssl-proxy --source "$HTTPS_PORT" --target "$TARGET_PORT" --cert "$CERT_FILE" --key "$KEY_FILE")
fi

exec "${CMD[@]}"


