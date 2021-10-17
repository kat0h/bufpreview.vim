command! -buffer PreviewMarkdown call denops#plugin#wait_async('bufpreview', {->denops#notify('bufpreview', 'md', ["open"])})
command! -buffer PreviewMarkdownClose call denops#plugin#wait_async('bufpreview', {->denops#notify('bufpreview', 'md', ["close"])})
command! -buffer PreviewMarkdownToggle call denops#plugin#wait_async('bufpreview', {->denops#notify('bufpreview', 'md', ["toggle"])})
