<template>
  <div id="app" class="">
    <index-editor :data-index="getIndex()" data-endpoint="/index"></index-editor>

    <chapter-form :data-page="{title:'Foo'}"></chapter-form>

    <page-form :data-page="{title:'Foo', body: 'Bar'}"></page-form>

    <people-editor 
      :data-page-people="getPeople()" 
      data-endpoint="/pages/1/people"
    ></people-editor>
    <person-form :data-person="getPeople()[0]"></person-form>
    
    <video-editor :data-page-video="getVideo()"></video-editor>
    <video-form :data-video="getVideo()[0]"></video-form>
    
    <moodboard-editor 
      :data-page-images="getImages()" 
      data-upload-endpoint="https://httpbin.org/post"
    ></moodboard-editor>
    
    <typography-editor
      :dataPageTypefaceFamilies="[
        {id: 1, title: 'Rubik', weights: [{name: 'Rubik bold', weight: 700}, {name: 'Rubik regular', weight: 400}], pivot: {preferences: {weight: 700}}},
      ]"
      :dataAllTypefaceFamilies="[
        {id: 1, title: 'Rubik', weights: [{name: 'Rubik bold', weight: 700}, {name: 'Rubik regular', weight: 400}, {name: 'Rubik light', weight: 300}]},
        {id: 2, title: 'Roboto', weights: [{name: 'Roboto bold', weight: 700},{name: 'Roboto regular', weight: 400}, {name: 'Roboto light', weight: 300}]},
      ]"
    ></typography-editor>
    <typeface-family-form :data-typeface-family="{id: 1, title: 'Rubik', weights: [{name: 'Rubik bold', weight: 700}, {name: 'Rubik regular', weight: 400}, {name: 'Rubik light', weight: 300}]}"></typeface-family-form>
    
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
    <logo-bg-form :data-logo="{id: 1, title: 'Primary', url: 'http://lorempixel.com/100/100/sports/1', pivot: {preferences: {'background-color': '#00ff00'}}}"></logo-bg-form>
    <logo-form :data-logo="{id: 1, title: 'Primary', url: 'http://lorempixel.com/100/100/sports/1', pivot: {preferences: {'background-color': '#00ff00'}}}"></logo-form>
    <logo-spec-form :data-logo="{id: 1, title: 'Primary', url: 'http://lorempixel.com/100/100/sports/1', pivot: {preferences: {'background-color': '#00ff00'}}}"></logo-spec-form>
    
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

    <colour-form :data-colour="{id: 1, title: 'Red', hex: '#ff0000'}"></colour-form>
  </div>
</template>

<script>
import ColourPaletteEditor from './components/ColourPaletteEditor.vue'
import IndexEditor from './components/IndexEditor.vue'
import LogoEditor from './components/LogoEditor.vue'
import MoodboardEditor from './components/MoodboardEditor.vue'
import PeopleEditor from './components/PeopleEditor.vue'
import TypographyEditor from './components/TypographyEditor.vue'
import VideoEditor from './components/VideoEditor.vue'
import {IndexHelper, MoodboardHelper} from './../tests/helpers/Helpers.js'
// Forms
import ChapterForm from './components/ChapterForm.vue'
import ColourForm from './components/ColourForm.vue'
import LogoBgForm from './components/LogoBgForm.vue'
import LogoForm from './components/LogoForm.vue'
import LogoSpecForm from './components/LogoSpecForm.vue'
import PageForm from './components/PageForm.vue'
import PersonForm from './components/PersonForm.vue'
import TypefaceFamilyForm from './components/TypefaceFamilyForm.vue'
import VideoForm from './components/VideoForm.vue'

export default {
  name: 'app',
  components: {
    // Editors
    ColourPaletteEditor, 
    IndexEditor,
    LogoEditor, 
    MoodboardEditor, 
    PeopleEditor, 
    TypographyEditor,
    VideoEditor,
    // Forms
    ChapterForm,
    ColourForm,
    LogoBgForm,
    LogoForm,
    LogoSpecForm,
    PageForm,
    PersonForm,
    TypefaceFamilyForm,
    VideoForm
  },
  methods: {
    getIndex: function() {
      let indexHelper = new IndexHelper;
      return indexHelper.makeStructure();
    },
    getImages: function() {
      let moodboardHelper = new MoodboardHelper;
      return moodboardHelper.getImages();
    },
    getVideo: function() {
      return [
        {id: 1, provider: 'vimeo', provider_id: '50719582'},
        {id: 2, provider: 'youtube', provider_id: 'Pq3hQ--Hbss'},
      ];
    },
    getPeople: function() {
      return [
        {id: 1, first_name: 'John', middle_name: '', last_name: 'Doe', full_name: 'John Doe', job_title: 'Founder', contacts: [
            {id: 1, type: 'email', value: {value: 'info@example.com'}},
            {id: 2, type: 'telephone', value: {prefix: '+39', number: '000 00 00 000'}}
          ]},
        {id: 2, first_name: 'Jane', middle_name: '', last_name: 'Doe', full_name: 'Jane Doe', job_title: 'SVP Marketing', contacts: [
            {id: 1, type: 'email', value: {value: 'info@example.com'}},
            {id: 2, type: 'telephone', value: {prefix: '+39', number: '000 00 00 000'}}
          ]}
      ];
    }
  }
}
</script>