import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { execute } from "https://deno.land/x/denops_std@v2.0.0/helper/mod.ts";
import { ensureString } from "https://deno.land/x/unknownutil@v1.1.2/mod.ts";
import * as op from "https://deno.land/x/denops_std@v2.0.0/option/mod.ts";
import { open } from "https://deno.land/x/open@v0.0.2/index.ts";

import Server from "./lib/server.ts";

let port: number;
let server: Server | undefined;
let isOpen = false;

const emptyPort = (s: number, e: number): number => {
  let i = 0;
  let n = false;
  for (i = s; i < e; i++) {
    try {
      Deno.listen({ port: i }).close();
    } catch (_) {
      n = true;
      continue;
    }
    n = false;
    if (n == false) {
      return i;
    }
  }
  return -1;
};

export function main(denops: Denops) {
  const openMD = async () => {
    // Check filetype
    if (await op.filetype.get(denops) as string !== "markdown") {
      console.error("This file is not markdown document");
      return;
    }

    if (server == undefined) {
      port = emptyPort(8000, 20000);
      // Make new server
      server = new Server(denops, port);
      server.run();
    } else {
      server.init();
    }
    open(`http://localhost:${port}`);
  };

  const closeMD = () => {
    if (server == undefined) {
      return;
    }
    server.stop();
  };

  denops.dispatcher = {
    async md(arg: unknown): Promise<void> {
      ensureString(arg);

      if (arg === "open") {
        await openMD();
        isOpen = true;
      } else if (arg === "close") {
        await closeMD();
        isOpen = false;
      } else if (arg === "toggle") {
        if (!isOpen) {
          await openMD();
        } else {
          await closeMD();
        }
        isOpen = !isOpen;
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
