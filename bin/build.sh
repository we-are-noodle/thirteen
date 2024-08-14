#!/bin/sh

set -e

rm -rf build/
mkdir -p build/zipped build/bundled

npm run build

bin/zip.js
