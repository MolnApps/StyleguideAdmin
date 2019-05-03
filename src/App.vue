<template>
  <div id="app" class="container mx-auto leading-normal">
    <colour-palette-editor 
    	:dataEndpoint="'/colours'" 
    	:dataPageColours="[{id: 2, title: 'Green', hex: '#00ff00'}]" 
    	:dataAllColours="[
    		{id: 1, title: 'Red', hex: '#ff0000'}, 
    		{id: 2, title: 'Green', hex: '#00ff00'}, 
    		{id: 3, title: 'Blue', hex: '#0000ff'}
    	]"
    ></colour-palette-editor>
  </div>
</template>

<script>
import ColourPaletteEditor from './components/ColourPaletteEditor.vue'

export default {
  name: 'app',
  components: {
    ColourPaletteEditor
  }
}
</script>