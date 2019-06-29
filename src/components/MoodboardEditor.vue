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
                :key="image.id" 
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
                <div class="PageItem__actions">
                    <span class="del PageItem__action" @click="onRemove(index)">Remove</span>
                </div>
            </div>
        </draggable>
        <moodboard-dropzone 
            :data-endpoint="dataUploadEndpoint"
            @success="onUploadSuccess"
        ></moodboard-dropzone>
        <div class="Actions">
            <btn ref="cancelChanges" @click="onCancel" type="secondary">Cancel changes</btn>
            <btn ref="saveChanges" @click="onSave" asynch>Save changes</btn>
        </div>
        <p v-for="message in feedback" v-text="message"></p>
    </div>
</template>

<script>
import Draggable from 'vuedraggable'
import MoodboardDropzone from './MoodboardDropzone.vue'
import StyleguideForm from './../StyleguideForm'
import Btn from './Btn.vue'
export default {
    components: {Btn, Draggable, MoodboardDropzone},
    props: [
        'dataPageImages', 
        'dataEndpoint',
        'dataUploadEndpoint'
    ],
    data() {
        return {
            pageImages: this.dataPageImages,
            form: null,
            feedback: []
        }
    },
    methods: {
        onRemove: function(index) {
            this.pageImages.splice(index, 1);
        },
        onSave: function() {
            let data = {
                image_id: this.pageImages.map((i) => {
                    return i.id;
                })
            };
            this.form = new StyleguideForm(data);
            this.form.on('success', this.onSuccess);
            this.form.submit(this.dataEndpoint);
        },
        onCancel: function() {
            this.$emit('cancel');
        },
        onSuccess: function(response) {
            this.feedback = this.form.feedback;
            this.$emit('success');
        },
        onUploadSuccess: function(image) {
            this.pageImages.push(image);
        }
    }
}
</script>