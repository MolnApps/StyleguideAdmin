<template>
    <div class="Container">
        <form id="chapterForm" @submit.prevent="" class="Form">
            <h2 class="Title" v-text="title"></h2>
            <div class="Form__row">
                <input type="text" name="title" v-model="form.title" class="Form__input" />
                <p v-for="error in form.errors.title" v-text="error"></p>
            </div>
            <div class="Actions Actions--noMargin">
                <button 
                    type="button" 
                    id="cancel" 
                    @click="cancel" 
                    class="Button Button--secondary Button--xl"
                >Cancel</button>
                <button 
                    type="submit" 
                    id="save" 
                    @click="save" 
                    class="Button Button--primary Button--xl"
                >Save</button>
            </div>
        </form>
        <p v-for="message in form.feedback" v-text="message"></p>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm';

export default {
    props: ['dataPage', 'dataEndpoint'],
    data() {
        return {
            form: new StyleguideForm(this.dataPage, ['title'])
        }
    },
    created() {
        this.form.on('success', this.onSuccess.bind(this));
        this.form.shouldReset(true);
    },
    computed: {
        title() {
            return this.form.id ? 'Edit chapter' : 'New chapter';
        }
    },
    methods: {
        save: function() {
            this.form.submit(this.dataEndpoint);
        },
        cancel: function() {
            this.form.reset();
            this.$emit('cancel');
        },
        onSuccess: function(response) {
            this.$emit('success', response.record);
        }
    }
}
</script>