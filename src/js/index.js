import Vue from 'vue'
import App from './components/App.vue'
import Editor from './components/Editor.vue'

Vue.component('editor', Editor)
require('../manifest.json')

new Vue({
  el: 'body',
  render: h => h(App),
})
