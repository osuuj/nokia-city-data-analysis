#!/bin/bash

# Create and setup the custom build directory for Next.js
BUILD_DIR="/tmp/next-build-cache"

echo "Setting up Next.js custom build directory..."

# Create the directory if it doesn't exist
if [ ! -d "$BUILD_DIR" ]; then
  mkdir -p "$BUILD_DIR"
  echo "✅ Created build directory: $BUILD_DIR"
else
  echo "✅ Build directory already exists: $BUILD_DIR"
fi

# Set permissions
chmod -R 755 "$BUILD_DIR"
echo "✅ Set permissions on build directory"

# If running in WSL, try to improve filesystem performance
if grep -q "microsoft" /proc/version; then
  echo "WSL detected. Configuring for better performance..."
  
  # Clean up any stale temp files
  rm -rf "$BUILD_DIR"/*
  echo "✅ Cleaned up old build files"
  
  # Ensure we're using the Linux filesystem
  if [[ "$BUILD_DIR" == /mnt/* ]]; then
    echo "⚠️ Warning: Your build directory is on the Windows filesystem."
    echo "   For better performance, use a path in the Linux filesystem like /tmp/next-build-cache"
  fi
fi

echo "Done! Your Next.js build directory is ready at $BUILD_DIR"
echo "Run 'npm run dev' to start development server with improved performance" 