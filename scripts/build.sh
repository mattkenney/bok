#!/bin/sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

# Make clean output dir and remove dist.zip
cd "$PROJECT_DIR"
rm -fr dist dist.zip
mkdir dist

# Install dev dependencies
npm install

# Build dist
npm run build

# Zip dist
cd dist
zip -r ../dist.zip *
