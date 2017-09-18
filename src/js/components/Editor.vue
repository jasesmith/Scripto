<template>
    <div class="note-area">
      <textarea></textarea>
    </div>
</template>

<script>
  import SimpleMDE from 'simplemde'
  import marked from 'marked'

  require('simplemde/dist/simplemde.min.css')

  export default {
    props: ['value'],
    mounted,
  }

  function mounted() {
    const md = initEditor(this.$el.childNodes[0], this.value)
    md.codemirror.on('change', () => {
      const val = this.md.value()
      this.$emit('input', val)
    })
    if(this.value) {
      md.togglePreview()
    }
    this.md = md
  }

  function initEditor(el, val) {
    class MarkedTaskListRenderer extends marked.Renderer {
      listitem(text) {
        if (/^\s*\[[dbsx\/\!\# ]\]\s*/.test(text)) {
          text = text
          .replace(/^\s*\[ \]\s*/, '<i class="todo-icon todo-undone fa fa-circle-o fa-fw"></i> <div>')
          .replace(/^\s*\[(x|d)\]\s*/, '<i class="todo-icon todo-done fa fa-check-circle fa-fw"></i> <div>')
          .replace(/^\s*\[(\/|s)\]\s*/, '<i class="todo-icon todo-started fa fa-play-circle fa-fw"></i> <div>')
          .replace(/^\s*\[(!|b|#)\]\s*/, '<i class="todo-icon todo-blocked fa fa-exclamation-circle fa-fw"></i> <div>')
          return '<li class="todo-item">' + text + '</div></li>'
        } else {
          return '<li>' + text + '</li>'
        }
      }
    }


    return new SimpleMDE({
      element: el,
      initialValue: val,
      spellChecker: true,
      blockStyles: {
        bold: "**",
        italic: "_"
      },
      placeholder: "write all the things...",
      toolbar: ['bold', 'italic', 'strikethrough', 'heading', 'code', 'quote', 'unordered-list', 'ordered-list', 'link', 'image', 'horizontal-rule', 'preview'],
      status: false,
      autoDownloadFontAwesome: true,
      forceSync: true,
      previewRender: function(plainText, preview) { // Async method
        setTimeout(function(){
          var renderer = new MarkedTaskListRenderer()
          preview.innerHTML = marked(plainText, {renderer});
        }, 1);
      },
      shortcuts: {
        'togglePreview': 'Cmd-S'
      },
      renderingConfig: {
        singleLineBreaks: true,
        codeSyntaxHighlighting: true,
      },
    })
  }
</script>
