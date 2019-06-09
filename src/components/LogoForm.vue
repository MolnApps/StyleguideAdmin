<template>
    <div class="Container">
        <form id="logoForm" class="Form" @submit.prevent="" enctype="multipart/form-data">
            <h3 class="Title">Logo</h3>
            <div class="Form__row">
                <input 
                    type="text" 
                    name="title" 
                    v-model="form.title" 
                    placeholder="Title" 
                    class="Form__input" 
                />
                <p v-for="error in form.errors.title" v-text="error"></p>
            </div>
            <div class="Form__row">
                <input 
                    type="file" 
                    name="file" 
                    class="Form__input" 
                    @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
                />
                <p v-for="error in form.errors.file" v-text="error"></p>
            </div>
            <div class="Actions Actions--noMargin">
                <button 
                    id="cancel" 
                    @click="cancel" 
                    class="Button Button--secondary Button--xl"
                >Cancel</button>
                <button 
                    id="save" 
                    @click="save" 
                    class="Button Button--primary Button--xl"
                >Save</button>
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
            this.form.on('success', this.onSuccess.bind(this));
            this.form.submit(this.dataEndpoint);
        },
        filesChange(fieldName, fileList)
        {
            this.form.filesChange(fieldName, fileList);
        },
        onSuccess: function(data) {
            this.resetForm();
            this.$emit('success', {
                data: data, 
                id: this.logo.id
            });
        },
        resetForm: function() {
            this.form = new StyleguideForm(this.logo, ['title']);
        }
    }
}
</script>