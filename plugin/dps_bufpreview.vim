augroup dps_mdpreview
  autocmd!
  autocmd FileType markdown call s:init_markdown_command()
augroup END

function! s:init_markdown_command() abort
  command! PreviewMarkdown call denops#notify('dps-bufpreview', 'md', ["open"])
  command! PreviewMarkdownClose call denops#notify('dps-bufpreview', 'md', ["close"])
  command! PreviewMarkdownToggle call denops#notify('dps-bufpreview', 'md', ["toggle"])
endfunction
