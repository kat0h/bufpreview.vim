import { listenAndServe } from "https://deno.land/std@0.108.0/http/server_legacy.ts";
import {
  acceptWebSocket,
  WebSocket,
} from "https://deno.land/std@0.108.0/ws/mod.ts";
import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";

import Markdown from "./markdown.ts";
import Buffer from "./buffer.ts";

export default class Server {
  private denops: Denops;
  private port: number;
  private body: string;

  private serverStarted = false

  private buffer: Buffer | undefined;
  private md = new Markdown();

  socket: WebSocket | undefined;

  constructor(denops: Denops, port: number) {
    this.port = port;
    this.body = Deno.readTextFileSync("./client/index.html");
    this.denops = denops;
    this.init();
  }

  async init() {
    this.buffer = new Buffer(
      this.denops,
      await this.denops.call("bufnr") as number,
      // TextChanged
      (buffer) => {
        if (this.socket == undefined) {
          return;
        }
        const data = {
          buf: this.md.toHTML(buffer.lines),
        };
        this.socket.send(JSON.stringify(data));
      },
      // CursorMoved
      (buffer) => {
        if (this.socket == undefined) {
          return;
        }
        const data = {
          cursorPos: buffer.cursorline,
        };
        this.socket.send(JSON.stringify(data));
      },
    );
  }

  run() {
    if (this.serverStarted) {
      return
    }
    listenAndServe(`:${this.port}`, (req) => {
      if (req.method === "GET" && req.url === "/") {
        // body
        req.respond({
          status: 200,
          body: this.body,
          headers: new Headers({
            "content-type": "text/html",
          }),
        });
      } else if (req.method === "GET" && req.url === "/ws") {
        // Websocket
        acceptWebSocket({
          conn: req.conn,
          bufWriter: req.w,
          bufReader: req.r,
          headers: req.headers,
        }).then(async (sock: WebSocket) => {
          this.socket = sock;
          if (this.buffer != undefined) {
            const data = {
              buf: this.md.toHTML(this.buffer.lines),
              bufname: this.buffer.bufname
            };
            this.socket.send(JSON.stringify(data));
          }
          try {
            for await (const ev of sock) {
              if (typeof ev === "string") {
                console.log("ws: Text", ev);
              }
            }
          } catch (_) {
            if (!sock.isClosed) {
              await sock.close(1000).catch(console.error);
            }
          }
        }).catch(async (_) => {
          await req.respond({ status: 400 });
        });
      } else {
        // 404 Error
        req.respond({ status: 404, body: "404" });
      }
    });
    this.serverStarted = true
  }

  stop() {
    if (this.buffer != undefined) {
      this.buffer.remove();
    }
    if (this.socket != undefined){
      this.socket.send(JSON.stringify({connect: "exit"}))
    }
    this.socket = undefined
  }
}
