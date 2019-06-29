<template>
    <div>
        <div class="Container" id="editor" v-if="! displayForm">
            <h3 class="Title">Video</h3>
            <draggable :list="pageVideo" class="List">
                <div v-for="(v, index) in pageVideo" :key="v.id" :data-id="v.id" class="List__item">
                    <div class="List__left">
                        Video {{ v.id }}
                    </div>
                    <div class="List__right">
                        <btn class="del" type="secondary" size="xs" @click="onRemove(index)">Remove</btn>
                        <btn class="edit" type="secondary" size="xs" @click="onEdit(v)">Edit</btn>
                    </div>
                </div>
                <div class="List__actions">
                    <btn ref="add" @click="onAdd">Add</btn>
                </div>
            </draggable>
            <div class="Actions">
                <btn ref="cancelChanges" @click="onCancelChanges" type="secondary">Cancel changes</btn>
                <btn ref="saveChanges" @click="onSaveChanges">Save changes</btn>
            </div>
            <p v-for="message in form.feedback" v-text="message"></p>
        </div>
        <video-form 
            v-if="displayForm"
            :data-endpoint="this.dataCreateEndpoint" 
            :data-video="video" 
            :key="video.id"
            @success="onSuccess"
            @cancel="onCancel"
        ></video-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import VideoForm from './VideoForm.vue'
import Draggable from 'vuedraggable'
import Btn from './Btn.vue'
export default {
    components: {Btn, VideoForm, Draggable},
    props: ['dataPageVideo', 'dataEndpoint', 'dataCreateEndpoint'],
    data() {
        return {
            pageVideo: this.dataPageVideo,
            video: {},
            displayForm: false,
            form: new StyleguideForm({video_id: []})
        };
    },
    methods: {
        onRemove: function(index) {
            this.pageVideo.splice(index, 1);
        },
        onEdit: function(video) {
            this.video = video;
            this.toggleForm();
        },
        onAdd: function() {
            this.video = {};
            this.toggleForm();
        },
        onSuccess: function(video) {
            this.pageVideo.push(video);
            this.toggleForm();
        },
        onCancel: function() {
            this.toggleForm();
        },
        onSaveChanges: function() {
            let ids = this.pageVideo.map((v) => { return v.id; });
            this.form = new StyleguideForm({video_id: ids});
            this.form.on('success', this.onSuccessChanges.bind(this));
            this.form.submit(this.dataEndpoint);
        },
        onSuccessChanges: function() {
            this.$emit('success');
        },
        onCancelChanges: function() {
            this.$emit('cancel');
        },
        toggleForm: function() {
            this.displayForm = ! this.displayForm;
        }
    }
}
</script>