import * as esbuild from "npm:esbuild@0.15.13";

esbuild.build({
  entryPoints: ["denops/bufpreview/lib/filetype/markdown/client/markdown.js"],
  bundle: true,
  format: "esm",
  target: "es2017",
  outfile: "denops/bufpreview/lib/filetype/markdown/client/markdown.bundle.js",
}).catch(() => process.exit(1));
