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
                    <btn ref="add" @click="onAdd" size="m">Add</btn>
                </div>
            </draggable>
            <div class="Actions">
                <btn ref="cancelChanges" @click="onCancelChanges" type="secondary">Cancel changes</btn>
                <btn ref="saveChanges" @click="onSaveChanges" asynch>Save changes</btn>
            </div>
        </div>
        <video-form 
            v-if="displayForm"
            :data-endpoint="dataEndpoint" 
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
    props: ['dataPage', 'dataPageEndpoint', 'dataEndpoint'],
    data() {
        return {
            video: {},
            displayForm: false,
            form: new StyleguideForm({video_id: []})
        };
    },
    computed: {
        pageVideo() {
            return this.$store.getters['video/byPageSlug'](this.dataPage.slug);
        }
    },
    methods: {
        onRemove: function(index) {
            this.$store.dispatch('video/removeFromPageByIndex', {
                page: this.dataPage, 
                index: index
            });
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
            this.$store.dispatch('video/addToPage', {
                page: this.dataPage, 
                record: video
            });
            this.toggleForm();
        },
        onCancel: function() {
            this.toggleForm();
        },
        onSaveChanges: function() {
            this.form = new StyleguideForm({
                video_id: this.$store.getters['video/idsForPage'](this.dataPage)
            });
            this.form.on('success', this.onSuccessChanges.bind(this));
            this.form.submit(this.dataPageEndpoint);
        },
        onSuccessChanges: function() {
            this.$emit('success');
            this.$emit('feedback', this.form.feedback);
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