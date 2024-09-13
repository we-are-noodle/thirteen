// rollup.config.js
import kontra from "rollup-plugin-kontra";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default [
  {
    output: {
      file: "src/kontra.js",
      format: "module",
    },
    input: "kontra-for-noodle.js",
    plugins: [
      nodeResolve(),
      kontra({
        gameObject: {
          anchor: true,
          // group: true,
          // scale: true,
        },
        sprite: {
          animation: true,
          image: true,
        },
      }),
      terser(),
    ],
  },
];
