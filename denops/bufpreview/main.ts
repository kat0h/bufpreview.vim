import { Denops, ensureString, fn, Lock, op, open, vars } from "./lib/deps.ts";

import Server from "./lib/server.ts";

// 一度に開けるサーバーは一つ
let server: Server | undefined;
const lock = new Lock();

export function main(denops: Denops) {
  denops.dispatcher = {
    async md(arg: unknown): Promise<void> {
      ensureString(arg);

      // オプションを設定
      const browser =
        (await vars.g.get(denops, "bufpreview_browser") || undefined) as
          | string
          | undefined;
      const opener: { app?: string } = { app: browser };
      const openBrowserFn =
        (await vars.g.get(denops, "bufpreview_open_browser_fn") ||
          "") as string;
      const host = (await vars.b.get(denops, "bufpreview_server_host") ||
        await vars.g.get(denops, "bufpreview_server_host") ||
        "127.0.0.1") as string;
      const port = (await vars.b.get(denops, "bufpreview_server_port") ||
        await vars.g.get(denops, "bufpreview_server_port") || 0) as number;

      // サーバーを開く
      const openServer = async () => {
        // サーバーが既に開かれているなら
        if (server != undefined) {
          server.close();
        }
        server = new Server(
          denops,
          await denops.call("bufnr") as number,
          () => {
            server = undefined;
          },
        );
        server.run(host, port);
        const link = `http://${server.host}:${server.port}`;
        if (openBrowserFn != "") {
          await fn.call(denops, openBrowserFn, [link]);
        } else {
          open(link, opener).catch((_) => {
            console.log(`Server started on ${link}`);
          });
        }
      };

      // サーバーを閉じる
      const closeServer = () => {
        if (server != undefined) {
          server.close();
          server = undefined;
        }
      };

      if (arg === "open") {
        if (await op.filetype.get(denops) == "markdown") {
          if (!lock.locked()) {
            await lock.with(openServer);
          }
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
            if (!lock.locked()) {
              await lock.with(openServer);
            }
          }
        }
      }
    },
  };
}
