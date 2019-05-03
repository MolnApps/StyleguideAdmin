<template>
    <div>
        <form id="logoForm" class="Form">
            <h3 class="Form__title">Logo</h3>
            <input 
                type="text" 
                name="title" 
                v-model="form.title" 
                placeholder="Title" 
                class="Form__input" 
            />
            <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            <input 
                type="file" 
                name="file" 
                class="Form__input" 
            />
            <p v-if="form.errors.file" v-for="error in form.errors.file" v-text="error"></p>
            <div class="Actions">
                <button id="cancel" @click="cancel" class="Button Button--secondary">Cancel</button>
                <button id="save" @click="save" class="Button Button--primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
export default {
    props: ['dataLogo', 'dataEndpoint'],
    data() {
        return {
            logo: this.dataLogo,
            logoId: null,
            form: null
        }
    },
    created() {
        this.resetForm();
    },
    methods: {
        cancel() {
            this.resetForm();
            this.$emit('cancel');
        },
        save() {
            this.logoId = this.eraseFormId();

            this.form.on('success', this.onSuccess.bind(this));

            this.form.submit(this.dataEndpoint);
        },
        eraseFormId: function() {
            let id;

            if (this.form.id) {
                id = this.form.id;
                this.form.id = '';
            }
            
            return id;
        },
        onSuccess: function(data) {
            this.resetForm();
            this.$emit('success', {
                data: data, 
                id: this.colourId
            });
        },
        resetForm: function() {
            this.form = new StyleguideForm(this.logo);
        }
    }
}
</script>