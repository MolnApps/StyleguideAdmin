<template>
    <div>
        <draggable :list="pageVideo" >
            <div v-for="(v, index) in pageVideo" :key="v.id" :data-id="v.id">
                Video {{ v.id }}
                <span class="del" @click="onRemove(index)">Remove</span>
                <span class="edit" @click="onEdit(v)">Edit</span>
            </div>
        </draggable>
        <video-form 
            :data-endpoint="this.dataCreateEndpoint" 
            :data-video="video" 
            :key="video.id"
            @success="onAdd"
        ></video-form>
        <div class="Actions">
            <button class="Button Button--secondary" id="cancelChanges" @click="onCancelChanges">Cancel changes</button>
            <button class="Button Button--primary" id="saveChanges" @click="onSaveChanges">Save changes</button>
        </div>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import VideoForm from './VideoForm.vue';
import Draggable from 'vuedraggable';
export default {
    components: {VideoForm, Draggable},
    props: ['dataPageVideo', 'dataEndpoint', 'dataCreateEndpoint'],
    data() {
        return {
            pageVideo: this.dataPageVideo,
            video: {}
        };
    },
    methods: {
        onRemove: function(index) {
            this.pageVideo.splice(index, 1);
        },
        onEdit: function(video) {
            this.video = video;
        },
        onAdd: function(video) {
            this.pageVideo.push(video);
        },
        onSaveChanges: function() {
            let ids = this.pageVideo.map((v) => { return v.id; });
            let form = new StyleguideForm({video_id: ids});
            form.submit(this.dataEndpoint);
            this.$emit('success');
        },
        onCancelChanges: function() {
            this.$emit('cancel');
        }
    }
}
</script>