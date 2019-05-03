<template>
    <div>
        <form id="chapterForm" @submit.prevent="save" class="p-16 flex flex-col">
            <h2 class="mb-4 text-center" v-text="title"></h2>
            <input type="text" name="title" v-model="form.title" class="input" />
            <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            <div class="flex">
                <button type="button" id="cancel" @click="cancel" class="btn btn-grey flex-1 mr-2">Cancel</button>
                <button type="submit" id="save" @click="save" class="btn btn-blue flex-1 ml-2">Save</button>
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
            form: new StyleguideForm(this.dataPage)
        }
    },
    computed: {
        title() {
            return this.page.id ? 'Edit chapter' : 'New chapter';
        }
    },
    methods: {
        save: function() {
            this.form.on('success', () => {
                this.$emit('success', this.form.data());
            });

            this.form.submit(this.dataEndpoint);
        },
        cancel: function() {
            this.$emit('cancel');
        }
    }
}
</script>