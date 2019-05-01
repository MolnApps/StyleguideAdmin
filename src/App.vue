<template>
  <div id="app" class="container mx-auto leading-normal">
    <page :dataEndpoint="'/pages/1'" :dataPage="{title:'Foo', body: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni ab, tempora vel. Nihil iusto aut magni eligendi exercitationem ipsum, similique quisquam voluptatum voluptas cum eum blanditiis accusamus fuga perferendis inventore?'}"/>
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