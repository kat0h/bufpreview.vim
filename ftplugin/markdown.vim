command! PreviewMarkdown call denops#plugin#wait_async('bufpreview', {->denops#notify('bufpreview', 'md', ["open"])})
command! PreviewMarkdownClose call denops#plugin#wait_async('bufpreview', {->denops#notify('bufpreview', 'md', ["close"])})
command! PreviewMarkdownToggle call denops#plugin#wait_async('bufpreview', {->denops#notify('bufpreview', 'md', ["toggle"])})
