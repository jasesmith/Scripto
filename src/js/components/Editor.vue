<template>
    <div class="note-area">
      <textarea></textarea>
    </div>
</template>

<script>
  import SimpleMDE from 'simplemde'

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
      toolbar: false,
      toolbarTips: false,
      status: false,
      autoDownloadFontAwesome: false,
      forceSync: true
    })
  }
</script>
