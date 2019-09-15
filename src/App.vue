<template>
	<div id="app" class="">
		<!-- Feedback tests -->
		<div class="Actions px-4">
			<btn size="s" @click="displayFeedback([
				{type: 'success', text: 'Hello world'},
			])">Display success feedback</btn>
			<btn size="s" @click="displayFeedback([
				{type: 'error', text: 'Hello world'},
			])" type="danger">Display error feedback</btn>
			<btn size="s" @click="displayDialog()">Display dialog</btn>
		</div>
		<!-- View editors -->
		<div v-if="isLoaded">
			<div class="Actions px-4">
				<btn size="xs" @click="pageId = 14">Colour palette editor</btn>
				<btn size="xs" @click="pageId = 10">Logo editor</btn>
				<btn size="xs" @click="pageId = 17">Moodboard editor</btn>
				<btn size="xs" @click="pageId = 4">People editor</btn>
				<btn size="xs" @click="pageId = 15">Typeface family editor</btn>
				<btn size="xs" @click="pageId = 19">Video editor</btn>
			</div>
			<!-- Dynamic component -->
			<component 
	            v-if="pageId" 
	            :is="resolveComponent" 
	            v-bind="resolveProps"
	            :key="pageId"
	            @feedback="displayFeedback"
	        ></component>
	        <!-- Index editor -->
			<index-editor 
				:data-index="$store.getters['index/index']" 
				:key="'index.' + $store.getters['index/index'].length"
				:data-endpoint="endpoint('/index')"
				:data-page-endpoint="endpoint('/pages')"
				:data-toggle-endpoint="endpoint('/pages/toggle')"
				@feedback="displayFeedback"
			></index-editor>
		</div>
        <!-- Notifications and Modals -->
        <notifications position="bottom center" classes="Feedback" width="50%" />
        <confirm-modal title="colour" @confirm="onConfirm" />
	</div>
</template>

<script>
import ConfirmModal from '@/modals/ConfirmModal.vue'

import ColourPaletteEditor from '@/components/ColourPaletteEditor.vue'
import IndexEditor from '@/components/IndexEditor.vue'
import LogoEditor from '@/components/LogoEditor.vue'
import MoodboardEditor from '@/components/MoodboardEditor.vue'
import PeopleEditor from '@/components/PeopleEditor.vue'
import TypographyEditor from '@/components/TypographyEditor.vue'
import VideoEditor from '@/components/VideoEditor.vue'
// Components
import Btn from '@/components/Btn.vue'

import axios from 'axios';

import Url from './Url.js';
import ComponentResolver from './ComponentResolver.js'

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
		// Components
		Btn,
		// Modals
		ConfirmModal
	},
	data() {
		return {
			pageId: null,
			resolver: new ComponentResolver(this.$store),
			url: new Url(),
			isLoaded: false
		}
	},
	created() {
		this.loadStyleguide();
	},
	methods: {
		loadStyleguide: function() {
			axios.get(this.endpoint('/all'))
				.then((r) => {
					// Initialize store
					this.$store.dispatch('pages/initialize', r.data['pages']);
					// Initialize pageables
					this.$store.dispatch('logos/initialize', r.data['logos']);
					this.$store.dispatch('colours/initialize', r.data['colour-palette']);
					this.$store.dispatch('typefaces/initialize', r.data['typefaces']);
					this.$store.dispatch('images/initialize', r.data['images']);
					this.$store.dispatch('video/initialize', r.data['videos']);
					this.$store.dispatch('people/initialize', r.data['contacts']);
					
					this.$store.dispatch('index/initialize', r.data['index']);
					
					this.isLoaded = true;
				})
				.catch((error) => {
					
				});
		},
		endpoint: function(path) {
			return this.url.append(path);
		},
		displayFeedback: function(feedback) {
			feedback.forEach((message) => {
                this.$notify(message);
            });
		},
		displayDialog: function() {
			this.$modal.show('confirm-modal');
		},
		onConfirm: function() {
			console.log('perform ajax request');
		}
	},
	computed: {
		resolveComponent() {
			this.resolver.setPage(this.page);
			return this.resolver.resolve(this.page.component);
        },
		resolveProps() {
			this.resolver.setPage(this.page);
			return this.resolver.resolveProps(this.page.component);
		},
		page() {
			return this.$store.getters['pages/byId'](this.pageId);
		}
	}
}
</script>