import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
import './http/index'
import './assets/fonts/iconfont.css'
import './assets/style/global.css'
import treeTable from 'vue-table-with-tree-grid'

import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
Vue.use(VueQuillEditor);//富文本编辑器插件

Vue.use(ElementUI);
Vue.component('tree-table',treeTable)
Vue.config.productionTip = false


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
