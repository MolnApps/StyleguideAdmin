<template>
    <div class="Container">
        <form id="pageForm" @submit.prevent="" :data-id="form.id" class="Form">
            <h2 class="Title" v-text="title"></h2>
            <div class="Form__row">
                <input 
                    type="text" 
                    name="title" 
                    v-model="form.title" 
                    class="Form__input" 
                />
                <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            </div>
            <div class="Form__row">
                <textarea 
                    name="body" 
                    v-model="form.body" 
                    class="Form__input Form__input--textarea"
                ></textarea>
                <p v-if="form.errors.body" v-for="error in form.errors.body" v-text="error"></p>
            </div>
            <input type="hidden" name="type" v-model="form.type" />
            <input type="hidden" name="component" v-model="form.component" />
            <div class="Actions Actions--noMargin">
                <button 
                    type="button" 
                    id="cancel" 
                    @click="onCancel" 
                    class="Button Button--secondary Button--xl"
                >Cancel</button>
                <button 
                    type="submit" 
                    id="save" 
                    @click="onSave" 
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
            form: new StyleguideForm(this.dataPage, ['title', 'body', 'type', 'component'])
        }
    },
    created() {
        this.form.shouldReset(true);
        this.form.on('success', this.onSuccess);
    },
    computed: {
        title() {
            return this.form.id ? 'Edit page' : 'New page';
        }
    },
    methods: {
        onSave: function() {
            this.form.submit(this.dataEndpoint);
        },
        onSuccess: function(response) {
            this.$emit('success', response.record);
        },
        onCancel: function() {
            this.form.reset();
            this.$emit('cancel');
        }
    }
}
</script>