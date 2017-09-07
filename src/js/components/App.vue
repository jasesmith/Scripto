<template>
  <body class="notes">
    <aside class="sidebar">
      <transition-group name="flip-list" tag="ul">
        <li v-for="note in notes" :key="note.id" :class="{ active: note === selected }">
          <span @click="selectNote(note)">{{ note.title }}</span>
          <span @click="removeNote(note)" v-if="note === selected"><i class="fa fa-times-circle fa-lg"></i></span>
        </li>
      </transition-group>
      <footer>
        <div @click="createNote"><i class="fa fa-plus fa-lg"></i></div>
      </footer>
    </aside>

    <main class="main">
      <transition name="fade" appear mode="out-in">
        <input v-if="selected" v-model="selected.title" :key="selected.id" type="text" placeholder="Title..." class="note-title" />
      </transition>
      <transition name="fade" appear mode="out-in">
        <editor v-if="selected" v-model="selected.body" :key="selected.id" placeholder="Notes..."></editor>
      </transition>
    </main>
  </body>
</template>

<script>
import guid from '../utils/guid'
import moment from 'moment'

const { chrome } = window
const SKEY = "SCRIPTO"

const component = {
  data: () => {
    return {
      notes: [],
      selected: undefined,
      toolboxIsOpen: false
    }
  },
  mounted: function() {
    const vm = this
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
</script>

<style lang="sass">
  @import '../../css/app.scss'
</style>
