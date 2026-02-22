#!/bin/sh

set -e

# Install dev dependencies
npm install

# Make clean output dir and zip
rm -fr dist dist.zip
mkdir dist

# Compile PUG to MJS
node -p 'require("pug").compileFileClient("src/template.pug")' \
  > dist/template.mjs
printf '\n%s\n' 'export { template };' >> dist/template.mjs

# Copy MJS
cp src/*.mjs dist

cd dist
zip -r ../dist.zip *
