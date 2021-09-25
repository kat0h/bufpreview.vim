augroup dps_mdpreview
  autocmd!
  autocmd FileType markdown call s:init_markdown_command()
augroup END

function! s:init_markdown_command() abort
  command! PreviewMarkdown call denops#notify('dps-mdpreview', 'md', ["open"])
  command! PreviewMarkdownClose call denops#notify('dps-mdpreview', 'md', ["close"])
  command! PreviewMarkdownToggle call denops#notify('dps-mdpreview', 'md', ["toggle"])
endfunction
