<template>
    <div>
        <div v-if="! editing">
            <h1 v-text="page.title"></h1>
            <p v-text="page.body"></p>
            <button id="edit" @click="edit">Edit</button>
        </div>
        <form v-if="editing" id="pageForm">
            <input type="text" name="title" v-model="form.title" />
            <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            <textarea name="body" v-model="form.body"></textarea>
            <p v-if="form.errors.body" v-for="error in form.errors.body" v-text="error"></p>
            <button id="cancel" @click="editing = !editing">Cancel</button>
            <button id="save" @click="save">Save</button>
        </form>
        <p v-for="message in this.form.feedback" v-text="message"></p>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm';

export default {
    props: ['dataPage', 'dataForm'],
    data() {
        return {
            page: this.dataPage,
            editing: false,
            form: new StyleguideForm(this.dataPage),
        }
    },
    methods: {
        edit: function() {
            this.toggle();
        },
        save: function() {
            this.page = JSON.parse(JSON.stringify(this.form.data()))

            this.form.on('success', () => {
                this.toggle();
            })

            this.form.submit('/pages/1');
        },
        cancel: function() {
            this.toggle();
        },
        toggle: function() {
            this.editing = ! this.editing;
        }
    }
}
</script>