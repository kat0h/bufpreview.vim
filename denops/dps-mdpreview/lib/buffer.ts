import { Denops } from "https://deno.land/x/denops_std@v2.0.0/mod.ts";
import * as autocmd from "https://deno.land/x/denops_std@v2.0.0/autocmd/mod.ts";
import * as anonymous from "https://deno.land/x/denops_std@v2.0.0/anonymous/mod.ts";

export default class Buffer {
  private _denops: Denops;
  private _bufnr: number;
  private _bufname = "";
  private _buf: string[] = [];

  private _onTextChanged: ((buffer: Buffer) => void) | null;
  private _onTextChangedCB = "";

  private _cursorMoved: ((buffer: Buffer) => void) | null;
  private _cusrorMovedCB = "";
  private _cursorLine = -1;

  constructor(
    denops: Denops,
    bufnr: number,
    onTextChanged: ((buffer: Buffer) => void) | null,
    cursorMoved: ((buffer: Buffer) => void) | null,
  ) {
    this._denops = denops;
    this._bufnr = bufnr;

    this._onTextChanged = onTextChanged;
    this._cursorMoved = cursorMoved;

    this.init();
  }

  private async init() {
    this._buf = await this._denops.call(
      "getbufline",
      this._bufnr,
      1,
      "$",
    ) as string[];
    this._bufname = await this._denops.call("expand", "%:t") as string;

    // textchanged callback
    this._onTextChangedCB = anonymous.add(this._denops, async () => {
      this._buf = await this._denops.call(
        "getbufline",
        this._bufnr,
        1,
        "$",
      ) as string[];
      this.igniteOnTextChanged();
    })[0];
    await autocmd.group(
      this._denops,
      `${this._denops.name}-${this._bufnr}`,
      (helper) => {
        helper.define(
          ["TextChanged", "TextChangedI", "TextChangedP"],
          "<buffer>",
          `call denops#notify("${this._denops.name}", "${this._onTextChangedCB}", [])`,
        );
      },
    );

    this._cursorLine = (await this._denops.call("getcurpos") as number[])[1];

    // cursorMoved collback
    this._cusrorMovedCB = anonymous.add(this._denops, async () => {
      this._cursorLine = (await this._denops.call("getcurpos") as number[])[1];
      this.ingiteCursorMoved();
    })[0];
    await autocmd.group(
      this._denops,
      `${this._denops.name}-${this._bufnr}`,
      (helper) => {
        helper.define(
          ["CursorMoved", "CursorMovedI"],
          "<buffer>",
          `call denops#notify("${this._denops.name}", "${this._cusrorMovedCB}", [])`,
        );
      },
    );

    this.igniteOnTextChanged();
  }

  async remove() {
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
  }

  get bufname(): string {
    return this._bufname
  }

  get lines(): string[] {
    return this._buf;
  }

  get cursorline(): number {
    return this._cursorLine;
  }

  private igniteOnTextChanged() {
    if (this._onTextChanged == null) {
      return;
    }
    this._onTextChanged(this);
  }

  private ingiteCursorMoved() {
    if (this._cursorMoved == null) {
      return;
    }
    this._cursorMoved(this);
  }
}
