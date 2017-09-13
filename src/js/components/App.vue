<template>
  <body class="notes">
    <svg style="display: none">
      <symbol viewBox="0 0 34 34" id="x">
          <path d="M9.45752767,10.4003367 L10.4003367,9.45752767 C10.790861,9.06700338 11.424026,9.06700338 11.8145503,9.45752767 L17,14.6429774 L22.1854497,9.45752767 C22.575974,9.06700338 23.209139,9.06700338 23.5996633,9.45752767 L24.5424723,10.4003367 C24.9329966,10.790861 24.9329966,11.424026 24.5424723,11.8145503 L19.3570226,17 L24.5424723,22.1854497 C24.9329966,22.575974 24.9329966,23.209139 24.5424723,23.5996633 L23.5996633,24.5424723 C23.209139,24.9329966 22.575974,24.9329966 22.1854497,24.5424723 L17,19.3570226 L11.8145503,24.5424723 C11.424026,24.9329966 10.790861,24.9329966 10.4003367,24.5424723 L9.45752767,23.5996633 C9.06700338,23.209139 9.06700338,22.575974 9.45752767,22.1854497 L14.6429774,17 L9.45752767,11.8145503 C9.06700338,11.424026 9.06700338,10.790861 9.45752767,10.4003367 Z" id="+"></path>
      </symbol>
    </svg>
    <aside class="sidebar">
      <header>
        <input placeholder="find..." class="note-filter" type="search" v-model="filter" />
        <button @click="createNote">
          <span class="fa-stack fa-lg">
            <i class="fa fa-sticky-note-o fa-stack-2x"></i>
            <i class="fa fa-plus fa-stack-1x"></i>
          </span>
        </button>
      </header>
      <transition-group name="flip-list" tag="ul">
        <li v-for="note in foundNotes" :key="note.id" :class="{ active: note === selected }" @click="selectNote(note)">
          <h4 class="note-name">
            <span>{{ note.title }}</span>
            <span class="x" @click.stop="tryDelete(note)" v-if="note === selected">
              <svg><use xlink:href="#x" /></svg>
            </span>
          </h4>
          <div class="note-preview">{{ note.body }}</div>
        </li>
      </transition-group>
    </aside>

    <main class="main">
      <header>
        <input v-if="selected" v-model="selected.title" :key="selected.id" type="text" placeholder="Title..." class="note-title" />
      </header>
      <transition name="fade" appear mode="out-in">
        <editor v-if="selected" v-model="selected.body" :key="selected.id" placeholder="Notes..."></editor>
      </transition>
    </main>
    <dialog id="👻">
      <header>Delete Note?</header>
      <footer>
        <button @click="cancelDelete()" class="primary">No</button>
        <button @click="confirmDelete(selected)">Yes</button>
      </footer>
    </dialog>
  </body>
</template>

<script>
import guid from '../utils/guid'
import moment from 'moment'

const { chrome } = window
const SKEY = "SCRIPTO"
const DIALOG_ID = "👻"

const component = {
  data () {
    return {
      notes: [],
      selected: undefined,
      toolboxIsOpen: false,
      dialog: null,
      filter: '',
    }
  },
  computed: {
    foundNotes () {
      return this.notes.filter(item => {
        return `${item.title} ${item.body}`.toLowerCase().includes(this.filter.toLowerCase().trim())
      })
    },
  },
  mounted () {
    const vm = this
    this.dialog = document.getElementById(DIALOG_ID)
    loadNotes(this)
    vm.$watch(function() {
      if (!this.selected) return undefined;
      return { id: this.selected.id, title: this.selected.title, body: this.selected.body };
    }, function(val, prev) {
      if (!prev) return;
      if (val.id === prev.id && (val.title !== prev.title || val.body !== prev.body)) {
        const ind = vm.notes.findIndex((x) => x.id === val.id);
        if (ind > 0) {
          const el = vm.notes[ind];
          vm.notes.splice(ind, 1);
          vm.notes = [el, ...vm.notes];
        }
        save(vm.notes);
      }
    }, {
      deep: true
    });
  },
  methods: {
    toggleTools,
    createNote,
    removeNote,
    tryDelete,
    cancelDelete,
    confirmDelete,
    dismissDialog,
    selectNote,
    clearAllNotes,
  },
}

export default component

function selectNote(note) {
  if (note === this.selected) {
    return
  }
  this.selected = note
}

function toggleTools() {
  this.toolboxIsOpen = !this.toolboxIsOpen
}

function createNote() {
  const note = {
    id: guid(),
    title: moment().format('dddd LT, MMM D'),
    body: ''
  }
  this.notes.unshift(note)
  this.selectNote(note)
  save(this.notes)
}

function removeNote(note) {
  const index = this.notes.findIndex((x) => x.id === note.id)
  this.notes = this.notes.filter((n) => n.id !== note.id)
  save(this.notes)
  if(this.notes.length > 0) {
    this.selected = this.notes[index]
  } else {
    this.selected = undefined
  }
}

function clearAllNotes() {
  chrome.storage.sync.clear()
  chrome.tabs.reload()
}

function save(notes) {
  if (!notes) {
    return
  }
  chrome.storage.sync.set({[SKEY]: notes})
}

function loadNotes(vm) {
  chrome.storage.sync.get(SKEY, ({ [SKEY]: list = [] }) => {
    vm.notes.push(...list) // Push all notes to array with ES6 splat syntax
    if(list.length) {
      vm.selectNote(list[0])
    }
  })
}

function tryDelete() {
  this.dialog.showModal()
}
function cancelDelete() {
  this.dismissDialog()
}
function dismissDialog() {
  const DIALOG = this.dialog
  const CALLBACK = function() {
    DIALOG.classList.remove('hide')
    DIALOG.close()
    DIALOG.removeEventListener('animationend', CALLBACK, false)
  }
  DIALOG.classList.add('hide')
  DIALOG.addEventListener('animationend', CALLBACK, false)
}
function confirmDelete(note) {
  this.removeNote(note)
  this.dismissDialog()
}
</script>

<style lang="sass">
  @import '../../css/app.scss'
</style>
