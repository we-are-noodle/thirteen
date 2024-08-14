#!/bin/sh

set -e

rm -rf build/ .parcel-cache/
mkdir -p build/zipped build/bundled

echo "# Building..."
npx parcel build

echo ""
echo "# Zipping..."
bin/zip.js
