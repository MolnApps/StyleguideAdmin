<template>
	<div id="app" class="">
		<notifications position="bottom center" classes="Feedback" width="50%" />
		<btn @click="displayFeedback">Display feedback</btn>
		<page-steps 
			:data-endpoint="endpoint('/pages')"
		></page-steps>

		<index-editor 
			:data-index="index" 
			:key="'index.' + index.length"
			:data-endpoint="endpoint('/index')"
			:data-page-endpoint="endpoint('/pages')"
			:data-toggle-endpoint="endpoint('/pages/toggle')"
		></index-editor>

		<chapter-form 
			:data-page="chapter" 
			:key="'chapter.' + chapter.id"
			:data-endpoint="endpoint('/pages')"
		></chapter-form>

		<page-form 
			:data-page="page" 
			:key="'page.' + page.id"
			:data-endpoint="endpoint('/pages')"
		></page-form>

		<people-editor 
			:data-page-people="people" 
			:key="'people' + people.length"
			:data-endpoint="endpoint('/pages/4/people')"
			:data-form-endpoint="endpoint('/people')"
		></people-editor>

		<person-form 
			:data-person="person" 
			:key="'person.' + person.id"
			:data-endpoint="endpoint('/people')"
		></person-form>
		
		<video-editor 
			:data-page-video="videos"
			:key="'videos.' + videos.length"
			:data-endpoint="endpoint('/pages/19/videos')"
			:data-create-endpoint="endpoint('/videos')"
		></video-editor>

		<video-form 
			:data-video="video" 
			:key="'video.' + video.id"
			:data-endpoint="endpoint('/videos')"
		></video-form>
		
		<moodboard-editor 
			:data-page-images="images" 
			:key="'images.' + images.length"
			:data-endpoint="endpoint('/pages/17/images')"
			:data-upload-endpoint="endpoint('/images')"
		></moodboard-editor>
		
		<typography-editor
			:data-page-typeface-families="typefaces"
			:data-all-typeface-families="typefacesLibrary"
			:key="'typefaces.' + typefaces.length"
			:data-endpoint="endpoint('/pages/15/typefaces')"
		></typography-editor>

		<typeface-family-form 
			:data-typeface-family="typeface"
			:key="'typeface.' + typeface.id"
			:data-endpoint="endpoint('/typefaces')"
		></typeface-family-form>
		
		<logo-editor 
			:data-page-logos="logos" 
			:key="'logos.' + logos.length"
			:data-all-logos="logosLibrary"
			:data-endpoint="endpoint('/pages/10/logos')"
		></logo-editor>
		<logo-bg-form 
			v-if="logoWithBg.id"
			:data-logo="logoWithBg"
			:key="'logo.bg.' + logoWithBg.id"
		></logo-bg-form>
		<logo-form 
			:data-logo="logo"
			:key="'logo.' + logo.id"
			:data-endpoint="endpoint('/logos')"
		></logo-form>
		<logo-spec-form 
			v-if="logoWithSpecs.id"
			:data-logo="logoWithSpecs"
			:key="'logo.specs.' + logoWithSpecs.id"
			:data-endpoint="endpoint('/logos')"
		></logo-spec-form>
		
		<colour-palette-editor 
			:dataPageColours="colours"
			:dataAllColours="coloursLibrary"
			:key="'colours.' + colours.length"
			:data-endpoint="endpoint('/colours')"
			:data-page-endpoint="endpoint('/pages/14/colours')"
		></colour-palette-editor>

		<colour-form 
			v-if="colour.id"
			:data-colour="colour"
			:key="'colour.' + colour.id"
			:data-endpoint="endpoint('/colours')"
		></colour-form>
	</div>
</template>

<script>
import PageSteps from './components/PageSteps.vue'

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
// Components
import Btn from './components/Btn.vue'

import axios from 'axios';

export default {
	name: 'app',
	components: {
		PageSteps,
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
		VideoForm,
		// Components
		Btn
	},
	data() {
		return {
			index: [],
			
			chapter: {},
			page: {},
			
			people: [],
			person: {},
			
			videos: [],
			video: {},
			
			images: [],
			
			typefacesLibrary: [],
			typefaces: [],
			typeface: {},
			
			logosLibrary: [],
			logos: [],
			logoWithBg: {},
			logoWithSpecs: {},
			logo: {},

			coloursLibrary: [],
			colours: [],
			colour: {}
		}
	},
	created() {
		this.loadStyleguide();
	},
	methods: {
		loadStyleguide: function() {
			axios.get(
				'http://styleguide-api.test/api/v1/all?styleguide_id=1'
			)
				.then((r) => {
					this.index = r.data.index;
					this.chapter = r.data.pages[0];
					this.page = r.data.pages[4];
					this.people = r.data.contacts['contacts'];
					this.person = this.people[0];
					this.videos = r.data.videos['reel'];
					this.video = this.videos[0];
					this.images = r.data.images['moodboard'];
					
					this.typefacesLibrary = r.data.typefaces['_library'];
					this.typefaces = r.data.typefaces['typography'];
					this.typeface = this.typefacesLibrary[0];

					this.logosLibrary = r.data.logos['_library'];
					this.logos = r.data.logos['logo-primary'];
					this.logoWithBg = r.data.logos['logo-primary'][1];
					this.logoWithSpecs = r.data.logos['_library'][0];
					this.logo = r.data.logos['_library'][0];

					this.coloursLibrary = r.data['colour-palette']['_library'];
					this.colours = r.data['colour-palette']['colour-palette'];
					this.colour = r.data['colour-palette']['_library'][0];
				})
				.catch((error) => {
					
				});
		},
		endpoint: function(path) {
			return 'http://styleguide-api.test/api/v1/1' + path;
		},
		displayFeedback: function() {
			this.$notify({
			  type: 'success',
			  title: 'Foobar',
			  text: 'Foo bar baz'
			});
		}
	}
}
</script>