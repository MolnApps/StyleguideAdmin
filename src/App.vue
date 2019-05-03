<template>
  <div id="app" class="container mx-auto leading-normal">
    <logo-editor 
    	:dataEndpoint="'/logos'" 
    	:dataPageLogos="[
        {id: 1, title: 'Primary', url: 'storage/logo.svg', pivot: {preferences: {'background-color': '#00ff00'}}},
        {id: 1, title: 'Primary', url: 'storage/logo.svg', pivot: {preferences: {'background-color': '#ff0000'}}}
      ]" 
    	:dataAllLogos="[
    		{id: 1, title: 'Primary', url: 'storage/logo.svg'}, 
    		{id: 2, title: 'Secondary positive', url: 'storage/logo-black.svg'}, 
    		{id: 3, title: 'Secondary negative', url: 'storage/logo-white.svg'}
    	]"
    ></logo-editor>
  </div>
</template>

<script>
import LogoEditor from './components/LogoEditor.vue'

export default {
  name: 'app',
  components: {
    LogoEditor
  }
}
</script>