<template>
    <component 
        v-if="page" 
        :is="resolveComponent" 
        v-bind="resolveProps"
        :key="page.id"
        @feedback="onFeedback"
        @cancel="onCancelChanges"
        @success="onSaveChanges"
    ></component>
</template>

<script>
import bus from './../bus.js';
import ComponentResolver from './../ComponentResolver.js'

import ColourPaletteEditor from './ColourPaletteEditor.vue'
import LogoEditor from './LogoEditor.vue'
import MoodboardEditor from './MoodboardEditor.vue'
import PeopleEditor from './PeopleEditor.vue'
import TypographyEditor from './TypographyEditor.vue'
import VideoEditor from './VideoEditor.vue'

export default {
    props: ['page'],
    components: {
        ColourPaletteEditor, 
        LogoEditor, 
        MoodboardEditor, 
        PeopleEditor, 
        TypographyEditor,
        VideoEditor,
    },
    data() {
        return {
            resolver: new ComponentResolver(this.$store),
        }
    },
    created() {
        
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
    },
    methods: {
        onFeedback: function(payload) {
            this.$emit('feedback', payload);
        },
        onCancelChanges: function(payload) {
            this.$emit('cancel', payload);
        },
        onSaveChanges: function(payload) {
            this.$emit('success', payload);
        }
    }
}
</script>