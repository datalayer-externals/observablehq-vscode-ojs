import alias from "@rollup/plugin-alias";
import commonjs from "@rollup/plugin-commonjs";
import sourcemaps from "rollup-plugin-sourcemaps";
import nodeResolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require("./package.json");

const plugins = [
    alias({
        entries: [
            { find: "@hpcc-js/common", replacement: "@hpcc-js/common/lib-es6/index.js" }
        ]
    }),
    nodeResolve({
        preferBuiltins: true
    }),
    commonjs({}),
    sourcemaps(),
    postcss({
        extensions: [".css"],
        minimize: true
    })
];

export default [{
    input: "lib-es6/webview",
    output: [{
        file: "dist/webview.js",
        format: "umd",
        sourcemap: true,
        name: pkg.name
    }],
    treeshake: {
        moduleSideEffects: (id, external) => {
            if (id.indexOf(".css") >= 0) return true;
            return false;
        }
    },
    plugins: plugins
}];