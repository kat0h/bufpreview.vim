// https://github.com/digitalmoksha/markdown-it-inject-linenumbers

// @ts-ignore 面倒
export default function inject_linenumbers_plugin(md) {
  //
  // Inject line numbers for sync scroll. Notes:
  //
  // - We track only headings and paragraphs, at any level.
  // - TODO Footnotes content causes jumps. Level limit filters it automatically.
  // @ts-ignore 型定義面倒
  function injectLineNumbers(tokens, idx, options, env, slf) {
    let line;
    // if (tokens[idx].map && tokens[idx].level === 0) {
    if (tokens[idx].map) {
      line = tokens[idx].map[0] + 1;
      tokens[idx].attrJoin("id", `source-line-${String(line)}`);
    }
    return slf.renderToken(tokens, idx, options, env, slf);
  }

  md.renderer.rules.paragraph_open = injectLineNumbers;
  md.renderer.rules.heading_open = injectLineNumbers;
  md.renderer.rules.list_item_open = injectLineNumbers;
  md.renderer.rules.table_open = injectLineNumbers;
}
