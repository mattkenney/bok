#!/bin/sh

set -e

# Make clean output dir and remove dist.zip
rm -fr dist dist.zip
mkdir dist

# Install dev dependencies
npm install
# Build dist
npm run build

# Zip dist
cd dist
zip -r ../dist.zip *
