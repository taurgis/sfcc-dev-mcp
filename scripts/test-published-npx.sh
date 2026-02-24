#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v jq >/dev/null 2>&1; then
  echo "jq is required but was not found in PATH"
  exit 1
fi

PACKAGE_NAME="${SFCC_MCP_NPX_PACKAGE_NAME:-sfcc-dev-mcp}"
REQUESTED_VERSION="${1:-${SFCC_MCP_NPX_VERSION:-}}"
WAIT_ATTEMPTS="${SFCC_MCP_NPX_WAIT_ATTEMPTS:-20}"
WAIT_SECONDS="${SFCC_MCP_NPX_WAIT_SECONDS:-15}"
MCP_TEST_SCRIPT="${SFCC_MCP_PUBLISHED_TEST_SCRIPT:-test:mcp:all}"
LEGACY_MCP_TEST_COMMAND="${SFCC_MCP_PUBLISHED_TEST_COMMAND:-}"
NPX_PREFIX_DIR=""

resolve_test_script() {
  local script_name="$1"
  local legacy_command="$2"

  if [[ -n "$legacy_command" ]]; then
    if [[ "$legacy_command" =~ ^npm[[:space:]]+run[[:space:]]+([A-Za-z0-9:_-]+)$ ]]; then
      script_name="${BASH_REMATCH[1]}"
    else
      echo "Unsupported SFCC_MCP_PUBLISHED_TEST_COMMAND format: ${legacy_command}" >&2
      echo "Use SFCC_MCP_PUBLISHED_TEST_SCRIPT=<npm-script-name> or SFCC_MCP_PUBLISHED_TEST_COMMAND='npm run <script>'" >&2
      return 1
    fi
  fi

  if [[ ! "$script_name" =~ ^[A-Za-z0-9:_-]+$ ]]; then
    echo "Invalid SFCC_MCP_PUBLISHED_TEST_SCRIPT value: ${script_name}" >&2
    return 1
  fi

  printf '%s' "$script_name"
}

MCP_TEST_SCRIPT="$(resolve_test_script "$MCP_TEST_SCRIPT" "$LEGACY_MCP_TEST_COMMAND")"

if [[ -n "$REQUESTED_VERSION" ]]; then
  PACKAGE_VERSION="$REQUESTED_VERSION"
else
  PACKAGE_VERSION="$(npm view "$PACKAGE_NAME" version)"
fi
PACKAGE_SPEC="${PACKAGE_NAME}@${PACKAGE_VERSION}"

echo "Running MCP tests against published package: ${PACKAGE_SPEC}"

DOCS_CONFIG="aegis.config.docs-only.json"
FULL_CONFIG="aegis.config.with-dw.json"
DOCS_BACKUP="$(mktemp "${DOCS_CONFIG}.bak.XXXXXX")"
FULL_BACKUP="$(mktemp "${FULL_CONFIG}.bak.XXXXXX")"

cleanup() {
  if [[ -f "$DOCS_BACKUP" ]]; then
    mv "$DOCS_BACKUP" "$DOCS_CONFIG"
  fi

  if [[ -f "$FULL_BACKUP" ]]; then
    mv "$FULL_BACKUP" "$FULL_CONFIG"
  fi

  if [[ -n "$NPX_PREFIX_DIR" && -d "$NPX_PREFIX_DIR" ]]; then
    rm -rf "$NPX_PREFIX_DIR"
  fi
}
trap cleanup EXIT

cp "$DOCS_CONFIG" "$DOCS_BACKUP"
cp "$FULL_CONFIG" "$FULL_BACKUP"

echo "Waiting for ${PACKAGE_SPEC} to become available on npm registry..."
CURRENT_ATTEMPT=0
until npm view "$PACKAGE_SPEC" version >/dev/null 2>&1; do
  CURRENT_ATTEMPT=$((CURRENT_ATTEMPT + 1))
  if [[ "$CURRENT_ATTEMPT" -ge "$WAIT_ATTEMPTS" ]]; then
    echo "Package ${PACKAGE_SPEC} was not available after ${WAIT_ATTEMPTS} attempts"
    exit 1
  fi
  echo "Attempt ${CURRENT_ATTEMPT}/${WAIT_ATTEMPTS}: package not available yet, retrying in ${WAIT_SECONDS}s..."
  sleep "$WAIT_SECONDS"
done

echo "Package is available. Reconfiguring MCP test launchers..."

NPX_PREFIX_DIR="$(mktemp -d /tmp/sfcc-mcp-npx-prefix.XXXXXX)"
echo "Using npm exec prefix directory: ${NPX_PREFIX_DIR}"

jq --arg pkg "$PACKAGE_SPEC" \
  --arg prefix "$NPX_PREFIX_DIR" \
  '.command = "npm" | .args = ["exec", "--yes", "--prefix", $prefix, "--package", $pkg, "--", "sfcc-dev-mcp"]' \
  "$DOCS_CONFIG" > "${DOCS_CONFIG}.tmp"
mv "${DOCS_CONFIG}.tmp" "$DOCS_CONFIG"

jq --arg pkg "$PACKAGE_SPEC" \
  --arg prefix "$NPX_PREFIX_DIR" \
  '.command = "npm" | .args = ["exec", "--yes", "--prefix", $prefix, "--package", $pkg, "--", "sfcc-dev-mcp", "--dw-json", "./tests/mcp/test-fixtures/dw.json", "--debug"]' \
  "$FULL_CONFIG" > "${FULL_CONFIG}.tmp"
mv "${FULL_CONFIG}.tmp" "$FULL_CONFIG"

echo "Executing MCP tests: npm run ${MCP_TEST_SCRIPT}"
npm run "$MCP_TEST_SCRIPT"

echo "Published NPX validation completed successfully for ${PACKAGE_SPEC}"
