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
                    <btn ref="cancel" @click="cancel" type="secondary">Cancel</btn>
                    <btn ref="save" @click="save" asynch>Save</btn>
                </div>
            </div>
            <p v-for="message in form.feedback" v-text="message"></p>
        </div>
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