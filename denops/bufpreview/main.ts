import { Denops } from "./deps.ts"
import { ensureString } from "./deps.ts"

import { isDebug } from "./util.ts"

export async function main(denops: Denops) {
  const debug = await isDebug(denops)
  if (debug) {
    console.debug(`[bufpreview] debug mode`)
  }

  denops.dispatcher = {
    async previewOpen(i_renderer: unknown): Promise<void> {
      ensureString(i_renderer)
      const renderer = i_renderer
      if (debug) {
        console.debug(`[bufpreview] previewOpen: ${renderer}`)
      }
      return await Promise.resolve()
    }
  }
  return Promise.resolve()
}
