import Vue from 'vue'
import App from './App.vue'
import Page from './components/Page.vue'
import PageForm from './components/PageForm.vue'

Vue.config.productionTip = false

Vue.component('page', Page);
Vue.component('page-form', PageForm);

new Vue({
  render: h => h(App),
}).$mount('#app')