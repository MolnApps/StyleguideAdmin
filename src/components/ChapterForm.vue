<template>
    <div class="Container">
        <form id="chapterForm" @submit.prevent="save" class="Form">
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
        <p v-for="message in this.form.feedback" v-text="message"></p>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm';

export default {
    props: ['dataPage', 'dataEndpoint'],
    data() {
        return {
            page: this.dataPage,
            form: new StyleguideForm(this.dataPage, ['title'])
        }
    },
    computed: {
        title() {
            return this.page.id ? 'Edit chapter' : 'New chapter';
        }
    },
    methods: {
        save: function() {
            this.form.on('success', (response) => {
                this.$emit('success', response.record);
            });

            this.form.submit(this.dataEndpoint, this.page);
        },
        cancel: function() {
            this.$emit('cancel');
        }
    }
}
</script>