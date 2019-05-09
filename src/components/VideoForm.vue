<template>
    <div>
        <form id="videoForm" class="Form" @submit.prevent="">
            <component v-bind:is="form.provider" :id="form.provider_id"></component>
            <video-url :data-endpoint="dataEndpoint + '/url'" @success="onEmbed"></video-url>
            <input type="hidden" name="provider" v-model="form.provider" />
            <input type="hidden" name="provider_id" v-model="form.provider_id" />
            <div class="Actions">
                <button id="cancel" @click="cancel" class="Button Button--secondary">Cancel</button>
                <button id="save" @click="save" class="Button Button--primary">Save</button>
            </div>
        </form>
    </div>
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
            
            this.$emit('success');
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