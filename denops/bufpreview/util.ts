import { Denops } from "./deps.ts"
import { vars } from "./deps.ts"
import { ensureBoolean } from "./deps.ts"

export async function isDebug(denops: Denops): Promise<boolean> {
  const debug = await vars.globals.get(denops, "bufpreview#debug", false)
  ensureBoolean(debug)
  return Promise.resolve(debug)
}
