<template>
  <div id="app" class="container mx-auto leading-normal">
    <index-editor :data-index="getIndex()"></index-editor>
    <typography-editor
      :dataPageTypefaceFamilies="[
        {id: 1, title: 'Rubik', weights: [{name: 'Rubik bold', weight: 700}, {name: 'Rubik regular', weight: 400}], pivot: {preferences: {weight: 700}}},
      ]"
      :dataAllTypefaceFamilies="[
        {id: 1, title: 'Rubik', weights: [{name: 'Rubik bold', weight: 700}, {name: 'Rubik regular', weight: 400}, {name: 'Rubik light', weight: 300}]},
        {id: 2, title: 'Roboto', weights: [{name: 'Roboto bold', weight: 700},{name: 'Roboto regular', weight: 400}, {name: 'Roboto light', weight: 300}]},
      ]"
    ></typography-editor>
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
import ColourPaletteEditor from './components/ColourPaletteEditor.vue'
import IndexEditor from './components/IndexEditor.vue'
import LogoEditor from './components/LogoEditor.vue'
import TypographyEditor from './components/TypographyEditor.vue'
import {IndexHelper} from './../tests/helpers/Helpers.js'

export default {
  name: 'app',
  components: {
    ColourPaletteEditor, 
    IndexEditor,
    LogoEditor, 
    TypographyEditor
  },
  methods: {
    getIndex: function() {
      let indexHelper = new IndexHelper;
      return indexHelper.makeStructure();
    }
  }
}
</script>