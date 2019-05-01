<template>
  <div id="app">
    <page :dataEndpoint="'/pages/1'" :dataPage="{title:'Foo', body: 'Bar'}"/>
  </div>
</template>

<script>
import Page from './components/Page.vue'

export default {
  name: 'app',
  components: {
    Page
  }
}
</script>