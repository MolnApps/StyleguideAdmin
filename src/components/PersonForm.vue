<template>
    <div>
        <form id="personForm" class="Form" :data-id="dataPerson.id" @submit.prevent="">
            <input type="text" v-model="form.first_name" name="first_name" class="Form__input" />
            <p v-for="message in form.errors.first_name" v-text="message"></p>
            <input type="text" v-model="form.middle_name" name="middle_name" class="Form__input" />
            <p v-for="message in form.errors.middle_name" v-text="message"></p>
            <input type="text" v-model="form.last_name" name="last_name" class="Form__input" />
            <p v-for="message in form.errors.last_name" v-text="message"></p>
            <input type="text" v-model="form.job_title" name="job_title" class="Form__input" />
            <p v-for="message in form.errors.job_title" v-text="message"></p>
            <contact-form :data-contacts="form.contacts"></contact-form>
            <div class="Actions">
                <button id="cancel" class="Button Button--secondary" @click="onCancel">Cancel</button>
                <button id="save" class="Button Button--primary" @click="onSave">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import ContactForm from './ContactForm.vue'
export default {
    components: {ContactForm},
    props: ['dataPerson', 'dataEndpoint'],
    data() {
        return {
            person: this.dataPerson,
            form: null
        }
    },
    created() {
        this.resetForm();
    },
    methods: {
        onSave: function() {
            this.form.on('success', this.onSuccess.bind(this));
            this.form.submit(this.dataEndpoint + '/' + this.person.id);
        },
        onSuccess: function(data) {
            this.person = data.record;
            this.resetForm();
            this.$emit('success');
        },
        onCancel: function() {
            this.resetForm();
            this.$emit('cancel');
        },
        resetForm: function() {
            this.form = new StyleguideForm(this.person, [
                'first_name', 
                'middle_name', 
                'last_name', 
                'job_title',
                'contacts'
            ]);
        }
    }
}
</script>