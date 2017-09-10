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
    class MarkedCustomRenderer extends marked.Renderer {
      listitem(text) {
        if (/^\s*\[[dbsx\/\!\# ]\]\s*/.test(text)) {
          text = text
          .replace(/^\s*\[ \]\s*/, '<i class="todo-undone fa fa-circle-o fa-fw"></i> ')
          .replace(/^\s*\[(x|d)\]\s*/, '<i class="todo-done fa fa-check-circle fa-fw"></i> ')
          .replace(/^\s*\[(\/|s)\]\s*/, '<i class="todo-started fa fa-play-circle fa-fw"></i> ')
          .replace(/^\s*\[(!|b|#)\]\s*/, '<i class="todo-blocked fa fa-exclamation-circle fa-fw"></i> ')
          return '<li class="todo-item" style="list-style: none">' + text + '</li>'
        } else {
          return '<li>' + text + '</li>'
        }
      }
    }

    var renderer = new MarkedCustomRenderer()

    return new SimpleMDE({
      element: el,
      initialValue: val,
      spellChecker: true,
      placeholder: "Type here...",
      toolbarTips: true,
      status: ["lines", "words", "cursor"],
      autoDownloadFontAwesome: true,
      forceSync: true,
      previewRender: function(plainText, preview) { // Async method
        setTimeout(function(){
          preview.innerHTML = marked(plainText, {renderer});
        }, 250);
        return "Loading...";
      },
      renderingConfig: {
        singleLineBreaks: false,
        codeSyntaxHighlighting: true,
      },
    })
  }
</script>
