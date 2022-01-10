" function g:bufpreview#preview_open(renderer: string): number
function! g:bufpreview#preview_open(renderer="")
  call g:denops#plugin#wait_async(
        \ 'bufpreview',
        \ {->denops#notify('bufpreview', 'previewOpen', [a:renderer])}
        \)
  return 0
endfunction

" function g:bufpreview#preview_close(session_id: number): bool
function! g:bufpreview#preview_close(session_id=-1)
  return v:true
endfunction

" function g:bufpreview#preview_toggle(session_id=-1): bool
function! g:bufpreview#preview_toggle(session_id=-1)
  return v:true
endfunction


" function g:bufpreview#print_sessions(): nil
function! g:bufpreview#print_sessions()
endfunction

" function g:bufpreview#sessions(): {id: number, desc: string}
function! g:bufpreview#sessions()
endfunction
