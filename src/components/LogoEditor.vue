<template>
    <div>
        <div v-if="! displayForm && ! displayBgForm">
        	<div class="page Logo__container">
            	<logo 
                    v-for="(logo, index) in pageLogos" 
                    :logo="logo" 
                    :editable="true" 
                    :key="index"
                    @remove="removeLogo"
                    @edit="editLogoBackground"
                ></logo>
            </div>
            <div class="Actions">
                <button id="add" class="Button Button--primary" @click="toggleForm">Add new logo</button>
            </div>
            <div class="all Logo__container">
            	<logo 
                    v-for="(logo, index) in allLogos" 
                    :logo="logo" 
                    :key="index"
                    :editable="false"
                    @click="addLogo"
                ></logo>
            </div>
            <div class="Actions">
                <button id="cancelChanges" @click="cancelChanges" class="Button Button--secondary">Cancel changes</button>
                <button id="saveChanges" @click="saveChanges" class="Button Button--primary">Save changes</button>
            </div>
        </div>
        <logo-form 
            v-if="displayForm"
            :data-endpoint="dataEndpoint" 
            :data-logo="logo" 
            @success="onSaveLogo"
            @cancel="resetLogoAndClose"
        ></logo-form>
        <logo-bg-form 
            v-if="displayBgForm"
            :data-logo="logo" 
            @success="toggleBgForm"
        ></logo-bg-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import Logo from './Logo.vue';
import LogoForm from './LogoForm.vue';
import LogoBgForm from './LogoBgForm.vue';
export default {
    components: {Logo, LogoForm, LogoBgForm},
    props: ['dataPageLogos', 'dataAllLogos', 'dataEndpoint'],
    data() {
    	return {
    		pageLogos: this.dataPageLogos,
    		allLogos: this.dataAllLogos,
            logo: {},
            displayForm: false,
            displayBgForm: false
    	}
    },
    created() {
        this.resetLogo();
    },
    methods: {
        onSaveLogo(data)
        {
            this.removeLogo({id: data.id});
            this.pageLogos.push(data.data.record);
            this.allLogos.push(data.data.record);
            this.resetLogoAndClose();
        },
        addLogo: function(logo) {
            let logoCopy = JSON.parse(JSON.stringify(logo));
            Object.assign(logoCopy, {pivot: {preferences: {'background-color': ''}}});
            this.pageLogos.push(logoCopy);
            this.editLogoBackground(logoCopy);
        },
        removeLogo: function(logo) {
            this.pageLogos = this.pageLogos.filter((l) => {
                return l.id != logo.id || l.pivot.preferences['background-color'] != logo.pivot.preferences['background-color'];
            });
        },
        resetLogoAndClose()
        {
            this.resetLogo();
            this.toggleForm();
        },
        resetLogo: function() {
            this.logo = {
                id: '', 
                title: '', 
                url: ''
            };
        },
        toggleForm() {
            this.displayForm = ! this.displayForm;
        },
        editLogoBackground(logo) {
            this.logo = logo;
            this.toggleBgForm();
        },
        toggleBgForm() {
            this.displayBgForm = ! this.displayBgForm;
        },
        cancelChanges() {
            this.$emit('cancel');
        },
        saveChanges() {
            let form = new StyleguideForm({foo: 'bar'});

            form.on('success', () => {
                this.$emit('success');
            });

            form.submit('/pages/1/logos');
        }
    }
}
</script>
<style lang="scss">
.Logo__container {
    justify-content: center;
	display: flex;
    border: 1px solid #ccc;
    padding: 24px;
    margin-bottom: 24px;
}
</style>