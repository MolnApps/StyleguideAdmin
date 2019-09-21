<template>
    <div class="Container">
        <h3 class="Title">Moodboard</h3>
        <draggable 
            tag="div" 
            :list="pageImages" 
            class="page PageItem__container"
        >
            <div 
                v-for="(image, index) in pageImages" 
                :data-id="image.id" 
                :key="'image' + image.id" 
                class="image PageItem"
            >
                <div class="PageItem__fill PageItem__fill--noWidth">
                    <img 
                        :src="image.url" 
                        :width="image.width" 
                        :height="image.height" 
                        class="PageItem__image"
                    />
                </div>
                <div class="Actions Actions--small">
                    <btn class="del" type="secondary" size="xs" @click="onRemove(index)">Remove</btn>
                </div>
            </div>
        </draggable>
        <moodboard-dropzone 
            :data-endpoint="dataEndpoint"
            @success="onUploadSuccess"
            @feedback="onUploadFeedback"
        ></moodboard-dropzone>
        <div class="Actions">
            <btn ref="cancelChanges" @click="onCancel" type="secondary">Cancel changes</btn>
            <btn ref="saveChanges" @click="onSave" asynch>Save changes</btn>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import MoodboardDropzone from './MoodboardDropzone.vue'
import StyleguideForm from './../StyleguideForm'
import Btn from './Btn.vue'
import bus from './../bus.js'
export default {
    components: {Btn, Draggable, MoodboardDropzone},
    props: [
        'dataPage', 
        'dataPageEndpoint',
        'dataEndpoint'
    ],
    data() {
        return {
            form: null
        }
    },
    computed: {
        pageImages() {
            return this.$store.getters['images/byPageSlug'](this.dataPage.slug);
        }
    },
    methods: {
        onRemove: function(index) {
            this.$store.dispatch('images/removeFromPageByIndex', {
                page: this.dataPage, 
                index: index
            });
        },
        onSave: function() {
            let data = {
                image_id: this.$store.getters['images/idsForPage'](this.dataPage)
            };
            this.form = new StyleguideForm(data);
            this.form.on('success', this.onSuccess);
            this.form.submit(this.dataPageEndpoint);
        },
        onCancel: function() {
            this.$emit('cancel');
        },
        onSuccess: function(response) {
            this.$emit('success');
            bus.$emit('feedback', this.form.feedback);
        },
        onUploadSuccess: function(image) {
            this.$store.dispatch('images/addToPage', {
                page: this.dataPage, 
                record: image
            });
        },
        onUploadFeedback: function(feedback) {
            bus.$emit('feedback', feedback);
        }
    }
}
</script>