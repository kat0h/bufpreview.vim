// Rendering MarkDown to HTML
import MarkdownIt from "https://esm.sh/markdown-it";
import HighlightJs from "https://esm.sh/highlight.js";

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
    this.md.linkify.set({ fuzzyEmail: false });
  }
  toHTML(lines: string[]): string {
    return this.md.render(lines.join("\n"));
  }
}
