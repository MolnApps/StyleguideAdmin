<template>
    <div class="Form__row Form__row--noMargin">
        <input 
            :placeholder="getRandomPlaceholder()" 
            v-model="form.url" 
            @input="onInput" 
            type="text" 
            name="url" 
            class="Form__input" 
        />
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
export default {
    props: ['dataEndpoint'],
    data() {
        return {
            form: new StyleguideForm({url: ''})
        }
    },
    created() {
        this.form.on('success', this.onSuccess.bind(this));
    },
    methods: {
        onInput: function() {
            this.form.submit(this.dataEndpoint);
        },
        onSuccess: function(data) {
            this.$emit('success', data);
        },
        getRandomPlaceholder: function() {
            return 'https://www.youtube.com/watch?v=abc123';
        }
    }
}
</script>