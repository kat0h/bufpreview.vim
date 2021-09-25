import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { execute } from "https://deno.land/x/denops_std@v2.0.0/helper/mod.ts";
import { ensureString } from "https://deno.land/x/unknownutil@v1.1.2/mod.ts";
import * as op from "https://deno.land/x/denops_std@v2.0.0/option/mod.ts";
import { open } from "https://deno.land/x/open@v0.0.2/index.ts";

import Server from "./lib/server.ts";
let server: Server | undefined;
const port = 8090;

export function main(denops: Denops) {
  denops.dispatcher = {
    async md(arg: unknown): Promise<void> {
      ensureString(arg);

      const openServer = async () => {
        // サーバーが既に開かれているなら
        if (server != undefined) {
          server.close();
        }
        server = new Server(
          denops,
          (await denops.call("bufnr") as number),
          port,
          () => {
            server = undefined;
          },
        );
        server.run();
        open(`http://localhost:${port}`);
      };

      const closeServer = () => {
        if (server != undefined) {
          server.close();
          server = undefined;
        }
      };

      if (arg === "open") {
        if (await op.filetype.get(denops) == "markdown") {
          openServer();
        }
      } else if (arg === "close") {
        closeServer();
      } else if (arg === "toggle") {
        // if server is already started
        if (server != undefined) {
          closeServer();
        } else {
          if (await op.filetype.get(denops) == "markdown") {
            openServer();
          }
        }
      }
    },
  },
    // function definition
    execute(
      denops,
      `
      command! PreviewMarkdown call denops#notify('${denops.name}', 'md', ["open"])
      command! PreviewMarkdownClose call denops#notify('${denops.name}', 'md', ["close"])
      command! PreviewMarkdownToggle call denops#notify('${denops.name}', 'md', ["toggle"])
    `,
    );
}
