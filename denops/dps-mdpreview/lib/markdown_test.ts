import { assertEquals } from "https://deno.land/std@0.108.0/testing/asserts.ts";
import Markdown from "./markdown.ts";

Deno.test("new MarkDown().toHTML() returns HTML", () => {
  const md = new Markdown();
  const actual = md.toHTML(["# Test", "**Test**", "テスト"]);
  const expected = "<h1>Test</h1>\n<p><strong>Test</strong>\nテスト</p>\n";
  assertEquals(actual, expected);
});
