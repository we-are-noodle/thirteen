#!/usr/bin/env node

import archiver from "archiver";
import fs from "fs";

function zip(dir, outputFilename) {
  return new Promise((resolve, reject) => {
    const archive = archiver("zip", { zlib: { level: 9 } });
    const output = fs.createWriteStream(outputFilename);
    output.on("close", () => {
      resolve(archive.pointer());
    });
    output.on("error", (error) => {
      reject(error);
    });
    archive.on("error", (error) => {
      reject(error);
    });
    archive.pipe(output);
    archive.directory(dir, "");
    archive.finalize();
  });
}

const LIMIT = 13 * 1024;

(async () => {
  try {
    const zipFile = "build/zipped/thirteen.zip";
    const packageSize = await zip("build/bundled", zipFile);
    const percent = ((packageSize / LIMIT) * 100).toFixed(2);
    console.log(
      `${zipFile} @ ${packageSize} byte / ${percent}% of ${LIMIT} bytes`,
    );
  } catch (error) {
    console.error("zip error", error);
  }
})();
