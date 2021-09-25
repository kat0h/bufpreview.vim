// Rendering MarkDown to HTML
import MarkdownIt from "https://esm.sh/markdown-it";
import HighlightJs from "https://esm.sh/highlight.js";
import KaTeX from "https://esm.sh/katex";
import TexMath from "http://esm.sh/markdown-it-texmath";

export default class Markdown {
  private md: typeof MarkdownIt;
  constructor() {
    this.md = new MarkdownIt({
      html: true,
      highlight: function (str: string, lang: string) {
        if (lang && HighlightJs.getLanguage(lang)) {
          try {
            return HighlightJs.highlight(str, { language: lang }).value;
          } catch (__) {
            console.log("err highlight.js");
          }
        }

        return "";
      },
    });
    this.md.use(TexMath, {
      engine: KaTeX,
      delimiters: "dollars",
      katexOptions: { macros: { "\\RR": "\\mathbb{R}" } },
    });
    const defaultRender = this.md.renderer.rules.link_open ||
      // @ts-ignore: 同下
      function (tokens, idx, options, _, self) {
        return self.renderToken(tokens, idx, options);
      };
    this.md.renderer.rules.link_open = function (
      // @ts-ignore: 型定義が死ぬほど面倒いため
      tokens,
      // @ts-ignore: 型定義が死ぬほど面倒いため
      idx,
      // @ts-ignore: 型定義が死ぬほど面倒いため
      options,
      // @ts-ignore: 型定義が死ぬほど面倒いため
      env,
      // @ts-ignore: 型定義が死ぬほど面倒いため
      self,
    ) {
      const aIndex = tokens[idx].attrIndex("target");
      if (tokens[idx]["attrs"][0][1].match("http")) {
        if (aIndex < 0) {
          tokens[idx].attrPush(["target", "_blank"]);
        } else {
          tokens[idx].attrs[aIndex][1] = "_blank";
        }
      }
      return defaultRender(tokens, idx, options, env, self);
    };
    this.md.linkify.set({ fuzzyEmail: false });
  }
  toHTML(lines: string[]): string {
    return this.md.render(lines.join("\n"));
  }
}
