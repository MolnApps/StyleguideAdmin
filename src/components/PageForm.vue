<template>
    <div class="Container">
        <form id="pageForm" @submit.prevent="" :data-id="dataPage.id" class="Form">
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
            form: new StyleguideForm(this.dataPage),
        }
    },
    computed: {
        title() {
            return this.dataPage.id ? 'Edit page' : 'New page';
        }
    },
    methods: {
        save: function() {
            this.form.on('success', (response) => {
                this.$emit('success', response.record);
            });

            this.form.submit(this.dataEndpoint);
        },
        cancel: function() {
            this.$emit('cancel');
        }
    }
}
</script>