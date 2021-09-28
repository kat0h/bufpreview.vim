import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { ensureString } from "https://deno.land/x/unknownutil@v1.1.2/mod.ts";
import * as op from "https://deno.land/x/denops_std@v2.0.0/option/mod.ts";
import { open } from "https://deno.land/x/open@v0.0.2/index.ts";

import Server from "./lib/server.ts";
let server: Server | undefined;

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
          () => {
            server = undefined;
          },
        );
        server.run();
        const link = `http://localhost:${server.port}`;
        open(link).catch((_) => {
          console.log(`Server started on ${link}`)
        });
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
        } else {
          console.error("not a markdown file");
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
  };
}
