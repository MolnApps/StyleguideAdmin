<template>
    <div class="Container">
        <h3 class="Title">Video</h3>
        <draggable :list="pageVideo" class="List">
            <div v-for="(v, index) in pageVideo" :key="v.id" :data-id="v.id" class="List__item">
                <div class="List__left">
                    Video {{ v.id }}
                </div>
                <div class="List__right">
                    <span 
                        class="del Button Button--secondary Button--xs" 
                        @click="onRemove(index)"
                    >Remove</span>
                    <span 
                        class="edit Button Button--secondary Button--xs" 
                        @click="onEdit(v)"
                    >Edit</span>
                </div>
            </div>
        </draggable>
        <video-form 
            :data-endpoint="this.dataCreateEndpoint" 
            :data-video="video" 
            :key="video.id"
            @success="onAdd"
        ></video-form>
        <div class="Actions">
            <button 
                class="Button Button--secondary Button--xl" 
                id="cancelChanges" 
                @click="onCancelChanges"
            >Cancel changes</button>
            <button 
                class="Button Button--primary Button--xl" 
                id="saveChanges" 
                @click="onSaveChanges"
            >Save changes</button>
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