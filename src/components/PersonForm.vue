<template>
    <div class="Container">
        <h3 class="Title">Person</h3>
        <form id="personForm" class="Form" :data-id="form.id" @submit.prevent="">
            <div class="Form__row">
                <input 
                    type="text" 
                    v-model="form.first_name" 
                    name="first_name" 
                    class="Form__input" 
                    placeholder="First name"
                />
                <p v-for="message in form.errors.first_name" v-text="message"></p>
            </div>
            <div class="Form__row">
                <input 
                    type="text" 
                    v-model="form.middle_name" 
                    name="middle_name" 
                    class="Form__input" 
                    placeholder="Middle name"
                />
                <p v-for="message in form.errors.middle_name" v-text="message"></p>
            </div>
            <div class="Form__row">
                <input 
                    type="text" 
                    v-model="form.last_name" 
                    name="last_name" 
                    class="Form__input" 
                    placeholder="Last name"
                />
                <p v-for="message in form.errors.last_name" v-text="message"></p>
            </div>
            <div class="Form__row">
                <input 
                    type="text" 
                    v-model="form.job_title" 
                    name="job_title" 
                    class="Form__input" 
                    placeholder="Job title"
                />
                <p v-for="message in form.errors.job_title" v-text="message"></p>
            </div>
            <contact-form :data-contacts="form.contacts"></contact-form>
            <div class="Actions">
                <btn ref="cancel" @click="onCancel" type="secondary">Cancel</btn>
                <btn ref="save" @click="onSave" asynch>Save</btn>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import ContactForm from './ContactForm.vue'
import Btn from './Btn.vue'
import bus from './../bus.js'
export default {
    components: {Btn, ContactForm},
    props: ['dataPerson', 'dataEndpoint'],
    data() {
        return {
            form: new StyleguideForm(this.dataPerson, [
                'first_name', 
                'middle_name', 
                'last_name', 
                'job_title',
                'contacts'
            ])
        }
    },
    created() {
        this.form.on('success', this.onSuccess.bind(this));
        this.form.shouldReset(true);
    },
    methods: {
        onSave: function() {
            this.form.submit(this.dataEndpoint, this.person);
        },
        onSuccess: function(data) {
            this.$emit('success', data.record);
            bus.$emit('feedback', data.feedback);
        },
        onCancel: function() {
            this.form.reset();
            this.$emit('cancel');
        }
    }
}
</script>