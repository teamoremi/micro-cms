#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting Micro-CMS package publishing process (with auto-version bump & sync)..."

# Define the root of the micro-cms project
MICRO_CMS_ROOT="$(dirname "$(readlink -f "$0")")"

# Navigate to the micro-cms root
cd "$MICRO_CMS_ROOT"

# --- Step 1: Check npm login status ---
echo "Verifying npm login status..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to npm. Please run 'npm login' and try again."
    exit 1
fi
echo "✅ Logged in to npm as $(npm whoami)."

# --- Step 2: Programmatic Dependency Sync ---
echo "🔗 Synchronizing internal dependencies..."

# Get the highest version found in any package.json
# We use this to ensure all internal @micro-cms/ dependencies point to the latest
LATEST_VERSION=$(grep -r '"version":' packages/*/package.json | awk -F'"' '{print $4}' | sort -V | tail -n1)
echo "✨ Detected latest workspace version: $LATEST_VERSION"

for pkg_json in packages/*/package.json; do
  echo "  Syncing $pkg_json..."
  # Use jq to update any dependency/devDependency starting with @micro-cms/ to the LATEST_VERSION
  jq --arg VER "^$LATEST_VERSION" ' 
    if .dependencies then 
      .dependencies |= with_entries(if .key | startswith("@micro-cms/") then .value = $VER else . end) 
    else . end | 
    if .devDependencies then 
      .devDependencies |= with_entries(if .key | startswith("@micro-cms/") then .value = $VER else . end) 
    else . end
  ' "$pkg_json" > temp.json && mv temp.json "$pkg_json"
done
echo "✅ Internal dependencies synchronized to $LATEST_VERSION."

# --- Step 3: Build all packages ---
echo "🏗 Building all packages in the monorepo..."
pnpm -r build
echo "✅ All packages built successfully."

# --- Step 4: Define publishing order ---
PACKAGES=(
    "packages/types"
    "packages/core"
    "packages/admin-ui"
    "packages/mock-db"
    "packages/node-adapter"
)

# --- Step 5: Publish packages ---
for PKG_PATH in "${PACKAGES[@]}"; do
    PKG_DIR="$MICRO_CMS_ROOT/$PKG_PATH"
    if [ -d "$PKG_DIR" ]; then
        cd "$PKG_DIR"
        PKG_NAME=$(jq -r '.name' package.json)
        
        echo -e "\n📦 Processing $PKG_NAME..."
        
        PUBLISHED=false
        while [ "$PUBLISHED" == "false" ]; do
            CURRENT_PKG_VERSION=$(jq -r '.version' package.json)
            echo "  Current version: $CURRENT_PKG_VERSION"

            if npm view "$PKG_NAME@$CURRENT_PKG_VERSION" > /dev/null 2>&1; then
                echo "  ⚠️  $PKG_NAME@$CURRENT_PKG_VERSION already exists on npm. Bumping patch version..."
                npm version patch --no-git-tag-version
                NEW_PKG_VERSION=$(jq -r '.version' package.json)
                echo "  ✅ Version bumped to $NEW_PKG_VERSION. Rebuilding package..."
                pnpm build
            else
                echo "  ✨ Version $CURRENT_PKG_VERSION is unique. Publishing..."
                npm publish --access public
                echo "  ✅ Successfully published $PKG_NAME@$CURRENT_PKG_VERSION."
                PUBLISHED=true
            fi
        done
        
        cd "$MICRO_CMS_ROOT"
    else
        echo "❌ Directory not found: $PKG_DIR. Skipping."
    fi
done

echo -e "\n🎉 All specified packages processed and synchronized!"
