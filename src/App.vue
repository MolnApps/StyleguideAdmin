<template>
  <div id="app" class="container mx-auto leading-normal">
    <logo-editor 
    	:dataEndpoint="'/logos'" 
    	:dataPageLogos="[
        {id: 1, title: 'Primary', url: 'http://lorempixel.com/100/100/sports/1', pivot: {preferences: {'background-color': '#00ff00'}}},
        {id: 1, title: 'Primary', url: 'http://lorempixel.com/100/100/sports/1', pivot: {preferences: {'background-color': '#ff0000'}}}
      ]" 
    	:dataAllLogos="[
    		{id: 1, title: 'Primary', url: 'http://lorempixel.com/100/100/sports/1'}, 
    		{id: 2, title: 'Secondary positive', url: 'http://lorempixel.com/100/100/sports/2'}, 
    		{id: 3, title: 'Secondary negative', url: 'http://lorempixel.com/100/100/sports/3'}
    	]"
    ></logo-editor>
    <colour-palette-editor 
      :dataPageColours="[
        {id: 1, title: 'Red', hex: '#ff0000'},
        {id: 3, title: 'Blue', hex: '#0000ff'}
      ]"
      :dataAllColours="[
        {id: 1, title: 'Red', hex: '#ff0000'},
        {id: 2, title: 'Green', hex: '#00ff00'},
        {id: 3, title: 'Blue', hex: '#0000ff'}
      ]"
    ></colour-palette-editor>
  </div>
</template>

<script>
import LogoEditor from './components/LogoEditor.vue'
import ColourPaletteEditor from './components/ColourPaletteEditor.vue'

export default {
  name: 'app',
  components: {
    LogoEditor, ColourPaletteEditor
  }
}
</script>