import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import ElementUI from 'element-ui'

import treeTable from 'vue-table-with-tree-grid'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);//富文本编辑器插件

// Vue.use(ElementUI); cdn引入
Vue.component('tree-table',treeTable)
Vue.config.productionTip = false


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
