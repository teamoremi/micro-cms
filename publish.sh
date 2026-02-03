#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

# --- Step 1: Check for version argument ---
if [ -z "$1" ]; then
    echo "❌ Error: No version number specified."
    echo "Usage: ./publish.sh <version>"
    echo "Example: ./publish.sh 1.0.2"
    exit 1
fi

TARGET_VERSION=$1
echo "🚀 Starting Micro-CMS package publishing process for version $TARGET_VERSION..."

# Define the root of the micro-cms project
MICRO_CMS_ROOT="$(dirname "$(readlink -f "$0")")"

# Navigate to the micro-cms root
cd "$MICRO_CMS_ROOT"

# --- Step 2: Check npm login status ---
echo "Verifying npm login status..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to npm. Please run 'npm login' and try again."
    exit 1
fi
echo "✅ Logged in to npm as $(npm whoami)."

# --- Step 3: Synchronize all package versions ---
echo "🔗 Synchronizing all packages to version $TARGET_VERSION..."
for pkg_json in packages/*/package.json; do
  echo "  Syncing $pkg_json..."
  # Use jq to set the main version and update any internal @micro-cms/ dependencies
  jq --arg VER "$TARGET_VERSION" '
    .version = $VER |
    if .dependencies then 
      .dependencies |= with_entries(if .key | startswith("@micro-cms/") then .value = $VER else . end) 
    else . end | 
    if .devDependencies then 
      .devDependencies |= with_entries(if .key | startswith("@micro-cms/") then .value = $VER else . end) 
    else . end
  ' "$pkg_json" > temp.json && mv temp.json "$pkg_json"
done
echo "✅ All packages and internal dependencies synchronized to $TARGET_VERSION."

# --- Step 4: Build all packages ---
echo "🏗 Building all packages in the monorepo..."
# The -w flag tells pnpm to run the build in the root workspace, not just the sub-directories
pnpm -w build
echo "✅ All packages built successfully."

# --- Step 5: Define publishing order ---
# This order is important to ensure dependencies are published before packages that depend on them.
PACKAGES=(
    "packages/types"
    "packages/core"
    "packages/resource-module"
    "packages/express-adapter"
    "packages/admin-ui"
    "packages/mock-db"
    "packages/node-adapter"
    "packages/crypto-payments"
)

# --- Step 6: Publish packages ---
for PKG_PATH in "${PACKAGES[@]}"; do
    PKG_DIR="$MICRO_CMS_ROOT/$PKG_PATH"
    if [ -d "$PKG_DIR" ]; then
        cd "$PKG_DIR"
        PKG_NAME=$(jq -r '.name' package.json)
        
        echo -e "\n📦 Attempting to publish $PKG_NAME@$TARGET_VERSION..."
        
        # We no longer check for existing versions.
        # If the version already exists, npm publish will fail, which is the desired explicit behavior.
        if npm publish --access public; then
            echo "  ✅ Successfully published $PKG_NAME@$TARGET_VERSION."
        else
            echo "  ⚠️  Failed to publish $PKG_NAME@$TARGET_VERSION. It might already exist on npm."
            # We continue to the next package instead of exiting
        fi
        
        cd "$MICRO_CMS_ROOT"
    else
        echo "❌ Directory not found: $PKG_DIR. Skipping."
    fi
done

echo -e "\n🎉 All specified packages have been processed."
