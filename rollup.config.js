// rollup.config.js
import kontra from "rollup-plugin-kontra";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default {
  output: {
    file: "build/index.js",
    format: "cjs",
  },
  input: "entry.js",
  plugins: [
    nodeResolve(),
    kontra({
      gameObject: {
        anchor: true,
        group: true,
        opacity: true,
        scale: true,
        ttl: true,
      },
      sprite: {
        animation: true,
        image: true,
      },
      tileEngine: {
        query: true,
        tiled: true,
      },
      // turn on debugging
      debug: true,
    }),
    terser(),
  ],
};
