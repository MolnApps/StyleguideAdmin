<template>
    <div class="Form__row Form__row--noMargin">
        <input 
            :placeholder="getRandomPlaceholder()" 
            v-model="urlForm.url" 
            @input="onInput" 
            type="text" 
            name="url" 
            class="Form__input" 
        />
        <p v-for="message in urlForm.feedback" v-text="message"></p>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
export default {
    props: ['dataEndpoint'],
    data() {
        return {
            urlForm: null
        }
    },
    created() {
        this.urlForm = new StyleguideForm({url: ''});
    },
    methods: {
        onInput: function() {
            this.urlForm.on('success', this.onUrlSuccess.bind(this));
            this.urlForm.submit(this.dataEndpoint);
        },
        onUrlSuccess: function(data) {
            this.$emit('success', data.record);
        },
        getRandomPlaceholder: function() {
            return 'https://www.youtube.com/watch?v=abc123';
        }
    }
}
</script>