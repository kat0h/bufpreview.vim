import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import { v4 } from "https://deno.land/std@0.109.0/uuid/mod.ts";

import Buffer from "./buffer.ts";

export default class Server {
  private _denops: Denops;
  private _bufnr: number;
  private _onClose: () => void;

  private _buffer: Buffer;
  private _listener: Deno.Listener | undefined;
  private _body: string;

  private _sockets: Map<string, globalThis.WebSocket> = new Map<
    string,
    globalThis.WebSocket
  >();

  constructor(
    denops: Denops,
    bufnr: number,
    onClose: () => void,
    // サーバ側で通信が切断された時に呼ばれます
  ) {
    this._denops = denops;
    this._bufnr = bufnr;
    this._onClose = onClose;

    this._buffer = new Buffer(denops, this._bufnr);

    // 更新
    this._buffer.events.on("textChanged", (buffer) => {
      const data = {
        buf: buffer.lines
      };

      this._sockets.forEach((socket) => {
        socket.send(JSON.stringify(data));
      });
    });

    this._buffer.events.on("cursorMoved", (buffer) => {
      const data = {
        cursorLine: {
          linePos: buffer.cursorline,
          bufLengh: buffer.lines.length,
        },
      };
      this._sockets.forEach((socket) => {
        socket.send(JSON.stringify(data));
      });
    });

    // バッファが削除された時
    this._buffer.events.on("bufDelete", (_) => {
      this.close();
    });

    // クライアント
    this._body = Deno.readTextFileSync(
      new URL("./filetype/markdown/client/markdown.html", import.meta.url),
    );
  }

  run(host: string, port: int) {
    this._listener = Deno.listen({
      hostname: host,
      port: port,
    });
    this._serve(this._listener);
  }

  private async _serve(listenner: Deno.Listener) {
    const handleHttp = async (conn: Deno.Conn) => {
      for await (const e of Deno.serveHttp(conn)) {
        const { request, respondWith } = e;
        // クライアントを送付
        if (request.method === "GET" && new URL(request.url).pathname === "/") {
          respondWith(
            new Response(this._body, {
              status: 200,
              headers: new Headers({
                "content-type": "text/html",
              }),
            }),
          );
        } else if (
          request.method === "GET" && new URL(request.url).pathname === "/ws"
        ) {
          respondWith(this._wsHandle(request));
        }
      }
    };
    for await (const conn of listenner) {
      handleHttp(conn);
    }
  }

  // サーバとの通信
  private _wsHandle(request: Request): Response {
    const { socket, response } = Deno.upgradeWebSocket(request);
    const uid = v4.generate();

    this._sockets.set(uid, socket);
    socket.onopen = () => {
      // 初回接続時にバッファを送信する
      this._buffer.events.emit("textChanged", this._buffer);
      this._buffer.events.emit("cursorMoved", this._buffer);
      // 接続を確立したソケットのみに送信
      socket.send(JSON.stringify({ bufname: this._buffer.bufname }));
    };
    // ブラウザ側から通信が切断された時
    socket.onclose = () => {
      this._sockets.delete(uid);
    };
    socket.onmessage = (_) => {};
    return response;
  }

  // 終了処理
  close() {
    this._buffer.close();
    if (this._listener != undefined) {
      this._listener.close();
      this._listener = undefined;
    }
    this._sockets.forEach((socket) => {
      if (socket.readyState !== socket.CLOSED) {
        socket.send(JSON.stringify({ connect: "close" }));
      }
      socket.close();
    });
    this._onClose();
  }

  get host(): string {
    if (this._listener == undefined) {
      return -1;
    }
    return this._listener.addr.hostname as string;
  }

 get port(): number {
    if (this._listener == undefined) {
      return -1;
    }
    // @ts-ignore: type is not exposed
    return this._listener.addr.port as number;
  }
}
