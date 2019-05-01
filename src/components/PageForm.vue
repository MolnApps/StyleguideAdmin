<template>
    <div>
        <form id="pageForm" @submit.prevent="save">
            <input type="text" name="title" v-model="form.title" />
            <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            <textarea name="body" v-model="form.body"></textarea>
            <p v-if="form.errors.body" v-for="error in form.errors.body" v-text="error"></p>
            <button type="button" id="cancel" @click="cancel">Cancel</button>
            <button type="submit" id="save" @click="save">Save</button>
        </form>
        <p v-for="message in this.form.feedback" v-text="message"></p>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm';

export default {
    props: ['dataPage'],
    data() {
        return {
            form: new StyleguideForm(this.dataPage),
        }
    },
    methods: {
        save: function() {
            this.form.on('success', () => {
                this.$emit('success', this.form.data());
            });

            this.form.submit('/pages/1');
        },
        cancel: function() {
            this.$emit('cancel');
        }
    }
}
</script>