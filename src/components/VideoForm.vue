<template>
    <form id="videoForm" @submit.prevent="" class="Container">
        <h3 class="Title">Video</h3>
        <div class="w-1/2 mx-auto my-4">
            <component v-bind:is="form.provider" :id="form.provider_id"></component>
        </div>
        <video-url 
            :data-endpoint="dataEndpoint + '/url'" 
            @success="onEmbed"
        ></video-url>
        <input type="hidden" name="provider" v-model="form.provider" />
        <input type="hidden" name="provider_id" v-model="form.provider_id" />
        <div class="Actions">
            <btn ref="cancel" @click="cancel" size="m" type="secondary">Cancel</btn>
            <btn ref="save" @click="save" size="m" asynch>Save</btn>
        </div>
        <p v-for="message in form.feedback" v-text="message"></p>
    </form>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import VideoUrl from './VideoUrl.vue'
import Vimeo from './Vimeo.vue'
import Youtube from './Youtube.vue'
import Btn from './Btn.vue'
export default {
    components: {Btn, VideoUrl, Vimeo, Youtube},
    props: ['dataEndpoint', 'dataVideo'],
    data() {
        return {
            form: new StyleguideForm(this.dataVideo, ['title', 'provider', 'provider_id'])
        }
    },
    created() {
        this.form.shouldReset(true);
        this.form.on('success', this.onSuccess.bind(this));
    },
    methods: {
        save: function() {
            this.form.submit(this.dataEndpoint);
        },
        cancel: function() {
            this.form.reset();
            this.$emit('cancel');
        },
        onSuccess: function(data) {
            this.$emit('success', data.record);
        },
        onEmbed: function(data) {
            Object.assign(this.form, data.record);

            this.$emit('embedded');
        }
    }
}
</script>