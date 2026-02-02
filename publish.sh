#!/bin/bash

# Exit immediately if a command exits with a non-zero status.
set -e

echo "🚀 Starting Micro-CMS package publishing process (with auto-version bump)..."

# Define the root of the micro-cms project
MICRO_CMS_ROOT="$(dirname "$(readlink -f "$0")")"

# Navigate to the micro-cms root
cd "$MICRO_CMS_ROOT"

echo "Current directory: $(pwd)"

# --- Step 1: Check npm login status ---
echo "Verifying npm login status..."
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ Not logged in to npm. Please run 'npm login' and try again."
    exit 1
fi
echo "✅ Logged in to npm as $(npm whoami)."

# --- Step 2: Build all packages ---
# We'll build them once here, and then re-build individual packages if their version changes.
echo "🏗 Building all packages in the monorepo..."
pnpm -r build

echo "✅ All initial packages built successfully."

# --- Step 3: Define publishing order ---
PACKAGES=(
    "packages/types"
    "packages/core"
    "packages/admin-ui"
    "packages/mock-db"
    "packages/node-adapter"
)

# --- Step 4: Publish packages ---
for PKG_PATH in "${PACKAGES[@]}"; do
    PKG_DIR="$MICRO_CMS_ROOT/$PKG_PATH"
    if [ -d "$PKG_DIR" ]; then
        cd "$PKG_DIR"
        PKG_NAME=$(jq -r '.name' package.json)
        
        echo "\n📦 Processing $PKG_NAME..."
        
        PUBLISHED=false
        while [ "$PUBLISHED" == "false" ]; do
            CURRENT_PKG_VERSION=$(jq -r '.version' package.json)
            echo "  Current version: $CURRENT_PKG_VERSION"

            if npm view "$PKG_NAME@$CURRENT_PKG_VERSION" > /dev/null 2>&1; then
                echo "  ⚠️  $PKG_NAME@$CURRENT_PKG_VERSION already exists on npm. Bumping patch version..."
                # Bump version without creating a git tag
                npm version patch --no-git-tag-version -m "Bump version to %s for npm publish"
                NEW_PKG_VERSION=$(jq -r '.version' package.json)
                echo "  ✅ Version bumped to $NEW_PKG_VERSION. Rebuilding package..."
                
                # Rebuild the specific package after version bump
                pnpm build
            else
                echo "  ✨ Version $CURRENT_PKG_VERSION is unique. Publishing..."
                npm publish --access public
                echo "  ✅ Successfully published $PKG_NAME@$CURRENT_PKG_VERSION."
                PUBLISHED=true
            fi
        done
        
        cd "$MICRO_CMS_ROOT" # Go back to root for the next package
    else
        echo "❌ Directory not found: $PKG_DIR. Skipping."
    fi
done

echo "\n🎉 All specified packages processed!"
echo "Remember to update your consuming projects' package.json files to use the new versions."