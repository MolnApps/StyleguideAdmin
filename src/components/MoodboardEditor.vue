<template>
    <div>
        <draggable tag="div" :list="pageImages" class="page Image__container">
            <div v-for="(image, index) in pageImages" :data-id="image.id" :key="image.id" class="image Image">
                <img :src="image.src" :width="image.width" :height="image.height" />
                <span class="del" @click="onRemove(index)">Remove</span>
            </div>
        </draggable>
        <moodboard-dropzone 
            :data-endpoint="dataUploadEndpoint"
            @success="onUploadSuccess"
        ></moodboard-dropzone>
        <button id="saveChanges" @click="onSave">Save changes</button>
        <button id="cancelChanges" @click="onCancel">Cancel changes</button>
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