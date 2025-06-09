<div align="center">
✨ Markdown preview for Vim and Neovim ✨

![](https://user-images.githubusercontent.com/45391880/134791644-5f69ee3e-a6ab-4d24-878b-7131dc9a3f4c.gif)

</div>

> Powerd By [denops.vim](https://github.com/vim-denops/denops.vim)🐜

## introduction

Preview markdown on your browser.

Main features:

- 💻 Multi Pratform Support (Mac/Linux/Windows)
- 🙌 Supports Vim and Neovim
- 📡 Sync Cursor Position
- 🏃 Fast asynchronus updates
- 🎨 Syntax highlight
- 📊 Render yaml header
- 📈 Render plantUML
- ❤️ Simple Dependency and easy to install
- 🖋 KaTeX Support

## install & usage

### requirements

- [denops.vim](https://github.com/vim-denops/denops.vim)
- [Deno](https://deno.land) (>= 1.28.0)
- [Chrome](https://www.google.co.jp/chrome/)/[Safari](https://www.apple.com/jp/safari/)/[Firefox](https://www.mozilla.org/ja/firefox/new/)

### Install with [lazy.nvim](https://github.com/folke/lazy.nvim)

```lua
{
  'vim-denops/denops.vim',
  lazy = false,
},
{
  'kat0h/bufpreview.vim',
  dependencies = { "vim-denops/denops.vim" },
  build = "deno task prepare",
  lazy = false,
},
```
You don't need to lazy-load the denops plugin, since it loads its script files lazily by default.
One issue to note is that deno task prepare modifies the plugin's own repository, which can cause lazy.nvim's update process to fail.

### Install with [vim-plug](https://github.com/junegunn/vim-plug)

```vim
Plug 'vim-denops/denops.vim'
Plug 'kat0h/bufpreview.vim', { 'do': 'deno task prepare' }
```

### Install with [dein.vim](https://github.com/Shougo/dein.vim)

```vim
call dein#add('vim-denops/denops.vim')
call dein#add('kat0h/bufpreview.vim', {'build': 'deno task prepare'})
```

### Install with [minpac](https://github.com/k-takata/minpac)

```vim
call minpac#add('vim-denops/denops.vim')
call minpac#add('kat0h/bufpreview.vim', {'do': 'silent! !deno task prepare'})
```

### Install with [Vundle](https://github.com/VundleVim/Vundle.vim)

```vim
Plugin 'vim-denops/denops.vim'
Plugin 'kat0h/bufpreview.vim'
```

Then prepare the plugin manually where it was installed.

i.e.

```bash
cd ~/.vim/bundle/bufpreview.vim && deno task prepare
```

### Commands

```vim
" Start the preview
:PreviewMarkdown
" Stop the preview
:PreviewMarkdownStop
" Toggle the window
:PreviewMarkdownToggle
```

### Open preview window automatically

```vim
augroup bufpreview
  autocmd!
  autocmd Filetype markdown :PreviewMarkdown
augroup END
```

## Special Thanks

- [https://github.com/vim-denops/denops.vim](https://github.com/vim-denops/denops.vim)
- [https://github.com/iamcco/markdown-preview.nvim](https://github.com/iamcco/markdown-preview.nvim)
- [https://github.com/previm/previm](https://github.com/previm/previm)
- [https://github.com/gamoutatsumi/dps-ghosttext.vim](https://github.com/gamoutatsumi/dps-ghosttext.vim)
- [Vim-jp](https://vim-jp.org/)

## License

MIT

this plugin uses these libraly

- https://github.com/digitalmoksha/markdown-it-inject-linenumbers

## Author

[Kota Kato](https://github.com/kat0h)
