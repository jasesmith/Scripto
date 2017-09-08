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

    // Focusing into and setting cursor at the end (100 is long enought)
    // md.codemirror.focus()
    md.codemirror.setCursor(100)

    // On change communicate to v-model
    md.codemirror.on('change', () => {
      const val = this.md.value()
      this.$emit('input', val)
    })

    this.md = md
  }

  function initEditor(el, val) {
    return new SimpleMDE({
      element: el,
      initialValue: val,
      spellChecker: true,
      placeholder: "Type here...",
      // toolbar: true,
      toolbarTips: false,
      status: ["autosave", "lines", "words", "cursor"],
      autoDownloadFontAwesome: true,
      forceSync: true,
      previewRender: function(plainText, preview) { // Async method
        setTimeout(function(){
          preview.innerHTML = marked(plainText);
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
