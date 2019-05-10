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
                        :src="image.src" 
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
            <button id="cancelChanges" @click="onCancel" class="Button Button--secondary Button--xl">Cancel changes</button>
            <button id="saveChanges" @click="onSave" class="Button Button--primary Button--xl">Save changes</button>
        </div>
    </div>
</template>

<script>
import Draggable from 'vuedraggable';
import MoodboardDropzone from './MoodboardDropzone.vue';
import StyleguideForm from './../StyleguideForm';
export default {
    components: {Draggable, MoodboardDropzone},
    props: [
        'dataPageImages', 
        'dataEndpoint',
        'dataUploadEndpoint'
    ],
    data() {
        return {
            pageImages: this.dataPageImages
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
            let form = new StyleguideForm(data);
            form.on('success', this.onSuccess);
            form.submit(this.dataEndpoint);
        },
        onCancel: function() {
            this.$emit('cancel');
        },
        onSuccess: function() {
            this.$emit('success');
        },
        onUploadSuccess: function(image) {
            this.pageImages.push(image);
        }
    }
}
</script>