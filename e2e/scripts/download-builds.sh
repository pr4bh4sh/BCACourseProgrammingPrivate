#!/bin/bash

# Exit on error
set -e

REPO="pr4bh4sh/BCACourseProgrammingPrivate"
# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
# Target directory for downloads (relative to e2e folder)
TARGET_DIR="$SCRIPT_DIR/../../apps"

PLATFORM=$1 # android, ios, or all (default)

if [ -z "$PLATFORM" ]; then
    PLATFORM="all"
fi

mkdir -p "$TARGET_DIR"

echo "Fetching latest release information for $REPO..."

download_android() {
    echo "Cleaning old Android build..."
    rm -f "$TARGET_DIR"/*.apk
    
    echo "Downloading Android APK..."
    # Download using gh cli
    if ! command -v gh &> /dev/null; then
        echo "Error: gh (GitHub CLI) is not installed. Please install it to download from private repos."
        exit 1
    fi
    
    # Get the URL of the asset
    echo "Fetching Android APK URL..."
    ASSET_JSON=$(gh release view --repo "$REPO" --json assets)
    APK_URL=$(echo "$ASSET_JSON" | jq -r '.assets[] | select(.name | endswith(".apk")) | .url' | head -n 1)

    if [ -n "$APK_URL" ] && [ "$APK_URL" != "null" ]; then
        echo "Found Android APK at: $APK_URL"
    else
        echo "Warning: No .apk asset found in the latest release."
    fi

    gh release download --repo "$REPO" --pattern "*.apk" --dir "$TARGET_DIR" --clobber
    
    # Rename to a standard name if needed, assuming one APK
    APK_FILE=$(find "$TARGET_DIR" -name "*.apk" | head -n 1)
    if [ -n "$APK_FILE" ]; then
        echo "Downloaded: $APK_FILE"
        # Optional: Rename to app.apk for easier reference in tests
        # mv "$APK_FILE" "$TARGET_DIR/app.apk"
        # echo "Renamed to $TARGET_DIR/app.apk"
    else
        echo "Warning: No .apk file found."
    fi
}

download_ios() {
    echo "Cleaning old iOS build..."
    rm -f "$TARGET_DIR"/*.zip
    rm -rf "$TARGET_DIR"/*.app

    echo "Downloading iOS Build..."
     if ! command -v gh &> /dev/null; then
        echo "Error: gh (GitHub CLI) is not installed."
        exit 1
    fi

    gh release download --repo "$REPO" --pattern "*.zip" --dir "$TARGET_DIR" --clobber

    ZIP_FILE=$(find "$TARGET_DIR" -name "*ios*.zip" | head -n 1)
    
    if [ -n "$ZIP_FILE" ]; then
        echo "Unzipping iOS App: $ZIP_FILE"
        unzip -o "$ZIP_FILE" -d "$TARGET_DIR"
        rm "$ZIP_FILE"
        echo "iOS extracted."
    else
         echo "Warning: No iOS zip file found."
    fi
}

if [ "$PLATFORM" == "android" ]; then
    download_android
elif [ "$PLATFORM" == "ios" ]; then
    download_ios
else
    download_android
    download_ios
fi
