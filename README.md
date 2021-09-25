<p align="center">
✨ Markdown preview for Vim and Neovim ✨

![](https://user-images.githubusercontent.com/45391880/134754999-49232c5e-a5cc-471b-8c24-213f608e4461.gif)
</p>

> Powerd By [denops.vim](https://github.com/vim-denops/denops.vim)🐜

## introduction
Preview markdown on your browser.

Main features:
- 💻 Multi Pratform Support
- 💨 Quick launch
- 🙌 Supports Vim and Neovim
- 🏃 Fast asynchronus updates
- 🎨 Syntax highlight
- ❤️ Simple Dependency and easy to install

## install & usage
### requirements
- [denops.vim](https://github.com/vim-denops/denops.vim)
- [Deno](https://deno.land)
- [Chrome](https://www.google.co.jp/chrome/)/[Safari](https://www.apple.com/jp/safari/)/[Firefox](https://www.mozilla.org/ja/firefox/new/)

Install with [vim-plug](https://github.com/junegunn/vim-plug):
```vim
Plug 'vim-denops/denops.vim'
Plug 'kat0h/dps-mdpreview.vim'
```

Or install with [dein.vim](https://github.com/Shougo/dein.vim):
```vim
call dein#add('kat0h/dps-mdpreview.vim')
```

Or install with [minpac](https://github.com/k-takata/minpac):
```vim
call minpac#add('kat0h/dps-mdpreview.vim')
```

Or install with [Vundle](https://github.com/VundleVim/Vundle.vim):
```vim
Plugin 'kat0h/dps-mdpreview.vim'
```

Commands:
```
" Start the preview
:PreviewMarkdown
" Stop the preview
:PreviewMarkdownStop
" Toggle the window
:PreviewMarkdownToggle
```

## Author
[Kota Kato](https://github.com/kat0h)
