<template>
    <form id="videoForm" @submit.prevent="" class="Container">
        <h3 class="Title">Video</h3>
        <div class="w-1/2 mx-auto mt-4">
            <component v-bind:is="form.provider" :id="form.provider_id"></component>
        </div>
        <div class="List mt-4">
            <div class="List__item">
                <div class="List__left">
                    <video-url 
                        :data-endpoint="dataEndpoint + '/url'" 
                        @success="onEmbed"
                    ></video-url>
                    <input type="hidden" name="provider" v-model="form.provider" />
                    <input type="hidden" name="provider_id" v-model="form.provider_id" />
                </div>
                <div class="List__right">
                    <button 
                        id="cancel" 
                        @click="cancel" 
                        class="Button Button--secondary"
                    >Cancel</button>
                    <button 
                        id="save" 
                        @click="save" 
                        class="Button Button--primary"
                    >Save</button>
                </div>
            </div>
        </div>
    </form>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import VideoUrl from './VideoUrl.vue'
import Vimeo from './Vimeo.vue';
import Youtube from './Youtube.vue';
export default {
    components: {VideoUrl, Vimeo, Youtube},
    props: ['dataEndpoint', 'dataVideo'],
    data() {
        return {
            video: this.dataVideo,
            form: null
        }
    },
    created() {
        this.resetForm();
    },
    methods: {
        save: function() {
            this.form.on('success', this.onSuccess.bind(this));
            this.form.submit(this.dataEndpoint + '/' + this.video.id);
        },
        cancel: function() {
            this.resetForm();
            this.$emit('cancel');
        },
        onSuccess: function(data) {
            this.video = data.record; 
            this.resetForm();
            
            this.$emit('success', this.video);
        },
        onEmbed: function(record) {
            Object.assign(this.form, record);

            this.$emit('embedded');
        },
        resetForm: function() {
            this.form = new StyleguideForm(this.video, ['provider', 'provider_id']);
        }
    }
}
</script>