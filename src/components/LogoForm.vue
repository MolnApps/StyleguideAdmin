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
                <btn id="cancel" ref="cancel" @click="cancel" type="secondary">Cancel</btn>
                <btn id="save" ref="save" @click="save" asynch>Save</btn>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import Btn from './Btn.vue'
import bus from './../bus.js'
export default {
    components: {Btn},
    props: ['dataLogo', 'dataEndpoint'],
    data() {
        return {
            form: new StyleguideForm(this.dataLogo, ['title'])
        }
    },
    created() {
        this.form.on('success', this.onSuccess.bind(this));
        this.form.shouldReset(true);
    },
    methods: {
        cancel() {
            this.form.reset();
            this.$emit('cancel');
        },
        save() {
            this.form.submit(this.dataEndpoint);
        },
        filesChange(fieldName, fileList)
        {
            this.form.filesChange(fieldName, fileList);
        },
        onSuccess: function(data) {
            this.$emit('success', {
                data: data, 
                id: data.record.id
            });
            bus.$emit('feedback', data.feedback);
        }
    }
}
</script>