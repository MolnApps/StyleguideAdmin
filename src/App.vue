<template>
	<div id="app" class="">
		<!-- Feedback tests -->
		<div class="Actions px-4">
			<btn 
				size="s" 
				@click="displayFeedback([{type: 'success', text: 'Hello world'}])"
			>Display success feedback</btn>
			<btn 
				size="s" 
				@click="displayFeedback([{type: 'error', text: 'Hello world'}])" 
				type="danger"
			>Display error feedback</btn>
			<btn 
				size="s" 
				@click="$modal.show('confirm-modal')"
			>Display dialog</btn>
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
			<styleguide-editor 
				:page="$store.getters['pages/byId'](pageId)" 
				@cancel="pageId = null" 
				@feedback="displayFeedback"
			></styleguide-editor>
			<!-- Index editor -->
			<index-editor 
				:data-index="$store.getters['index/index']" 
				:key="'index.' + $store.getters['index/index'].length"
				:data-endpoint="url.append('/index')"
				:data-page-endpoint="url.append('/pages')"
				:data-toggle-endpoint="url.append('/pages/toggle')"
				@feedback="displayFeedback"
			></index-editor>
		</div>
        <!-- Notifications and Modals -->
        <notifications position="bottom center" classes="Feedback" width="50%" />
        <confirm-modal title="colour" />
	</div>
</template>

<script>
// Modals
import ConfirmModal from './modals/ConfirmModal.vue'
// Components
import StyleguideEditor from './components/StyleguideEditor.vue'
import IndexEditor from './components/IndexEditor.vue'
import Btn from './components/Btn.vue'

import Url from './Url.js';
import StyleguideLoader from './StyleguideLoader.js'
import bus from './bus.js';

export default {
	name: 'app',
	components: {
		StyleguideEditor, 
		IndexEditor,
		Btn,
		ConfirmModal
	},
	data() {
		return {
			pageId: null,
			
			url: new Url(),
			isLoaded: false
		}
	},
	created() {
		bus.$on('styleguide_loaded', this.onLoadStyleguide.bind(this));
		bus.$on('feedback', this.displayFeedback.bind(this));
		this.loadStyleguide();
	},
	methods: {
		loadStyleguide: function() {
			new StyleguideLoader(this.$store, this.url).load();
		},
		onLoadStyleguide: function() {
			this.isLoaded = true;
		},
		displayFeedback: function(feedback) {
			feedback.forEach((message) => {
                this.$notify(message);
            });
		}
	}
}
</script>