import { anonymous, autocmd, Denops, EventEmitter } from "./deps.ts";

type BufferEvents = {
  textChanged(buffer: Buffer): void;
  cursorMoved(buffer: Buffer): void;
  bufDelete(buffer: Buffer): void;
};

/*
 * Vimのバッファを扱う
 *
 * constroctor
 *  - denops: Denops
 *  - bufnr: number
 *    - バッファのbufnrを指定
 *
 * member
 *  - events
 *    バッファのイベントに対応するコールバックを登録
 *    - textChanged
 *    - cursorMoved
 *    - bufDelete
 *
 * getter
 *  - bufname: string
 *    バッファの名前を取得
 *  - lines: string[]
 *    バッファの内容を取得
 *
 * function
 *  - remove
 *    バッファとの関連付けを解除
 *    🚨 オブジェクト破棄前に必ず実行すること
 */
export default class Buffer {
  private _denops: Denops;
  private _bufnr: number;

  private _bufname = "";
  private _buf: string[] = [];
  private _cursorLine = -1;

  events: EventEmitter<BufferEvents>;
  private _textChanged = "";
  private _cursorMoved = "";
  private _bufDelete = "";

  constructor(
    denops: Denops,
    bufnr: number,
  ) {
    this._denops = denops;
    this._bufnr = bufnr;
    this.events = new EventEmitter<BufferEvents>();

    this.init();
  }

  private async init() {
    // 初回バッファ取得
    this._buf = await this._denops.call(
      "getbufline",
      this._bufnr,
      1,
      "$",
    ) as string[];
    this._bufname = await this._denops.call("expand", "%:t") as string;
    this._cursorLine = (await this._denops.call("getcurpos") as number[])[1];

    // textchanged callback
    this._textChanged = anonymous.add(this._denops, async () => {
      this._buf = await this._denops.call(
        "getbufline",
        this._bufnr,
        1,
        "$",
      ) as string[];
      this.events.emit("textChanged", this);
    })[0];
    // cursorMoved callback
    this._cursorMoved = anonymous.add(this._denops, async () => {
      this._cursorLine = (await this._denops.call("getcurpos") as number[])[1];
      this.events.emit("cursorMoved", this);
    })[0];
    // bufLeave callback
    this._bufDelete = anonymous.add(this._denops, () => {
      this.events.emit("bufDelete", this);
    })[0];

    await autocmd.group(
      this._denops,
      `${this._denops.name}-${this._bufnr}`,
      (helper) => {
        helper.define(
          ["TextChanged", "TextChangedI", "TextChangedP"],
          "<buffer>",
          `call denops#notify("${this._denops.name}", "${this._textChanged}", [])`,
        );
        helper.define(
          ["CursorMoved", "CursorMovedI"],
          "<buffer>",
          `call denops#notify("${this._denops.name}", "${this._cursorMoved}", [])`,
        );
        helper.define(
          ["BufDelete"],
          "<buffer>",
          `call denops#notify("${this._denops.name}", "${this._bufDelete}", [])`,
        );
      },
    );

    this.events.emit("textChanged", this);
    this.events.emit("cursorMoved", this);
  }

  // remove autocmd and anonymous function
  async close() {
    // remove autocmd
    await autocmd.group(
      this._denops,
      `${this._denops.name}-${this._bufnr}`,
      (helper) => {
        helper.remove(
          "*",
          "<buffer>",
        );
      },
    );
    // remove anonymous function
    anonymous.remove(this._denops, this._textChanged);
    anonymous.remove(this._denops, this._cursorMoved);
    anonymous.remove(this._denops, this._bufDelete);
  }

  // getter functions
  get bufname(): string {
    return this._bufname;
  }

  get lines(): string[] {
    return this._buf;
  }

  get cursorline(): number {
    return this._cursorLine;
  }
}
