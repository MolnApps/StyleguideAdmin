<template>
    <div>
        <div v-if="! displayForm && ! displayBgForm && ! displaySpecForm">
        	<draggable 
                :list="pageLogos" 
                class="page Logo__container"
            >
                <logo 
                    v-for="(logo, index) in pageLogos" 
                    :logo="logo" 
                    :editable-bg="true" 
                    :key="logo.id + logo.pivot.preferences['background-color']"
                    @remove="removeLogo"
                    @edit="editLogoBackground"
                ></logo>
            </draggable>
            <div class="Actions">
                <button id="add" class="Button Button--primary" @click="toggleForm">Add new logo</button>
            </div>
            <div class="all Logo__container">
            	<logo 
                    v-for="(logo, index) in allLogos" 
                    :logo="logo" 
                    :key="index"
                    :editable-spec="true"
                    @click="addLogo"
                    @edit-spec="editLogoSpecs"
                ></logo>
            </div>
            <div class="Actions">
                <button 
                    id="cancelChanges" 
                    @click="cancelChanges" 
                    class="Button Button--secondary"
                >Cancel changes</button>
                <button 
                    id="saveChanges" 
                    @click="saveChanges" 
                    class="Button Button--primary"
                >Save changes</button>
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
            @cancel="cancelEditLogoBackground"
        ></logo-bg-form>
        <logo-spec-form 
            v-if="displaySpecForm" 
            :data-logo="logo" 
            :data-endpoint="'/logos/' + logo.id"
            @success="toggleSpecForm"
            @cancel="toggleSpecForm"
        ></logo-spec-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import Logo from './Logo.vue';
import LogoForm from './LogoForm.vue';
import LogoBgForm from './LogoBgForm.vue';
import LogoSpecForm from './LogoSpecForm.vue';
import Draggable from 'vuedraggable';
export default {
    components: {Logo, LogoForm, LogoBgForm, LogoSpecForm, Draggable},
    props: ['dataPageLogos', 'dataAllLogos', 'dataEndpoint'],
    data() {
    	return {
    		pageLogos: this.dataPageLogos,
    		allLogos: this.dataAllLogos,
            logo: {},
            displayForm: false,
            displayBgForm: false,
            displaySpecForm: false,
            addingLogo: false
    	}
    },
    created() {
        this.resetLogo();
    },
    methods: {
        onSaveLogo(data)
        {
            let logoPage = JSON.parse(JSON.stringify(data.data.record));
            let logoAll = JSON.parse(JSON.stringify(data.data.record));
            this.assignDefaultBackground(logoPage);
            this.removeLogo({id: data.id});
            this.pageLogos.push(logoPage);
            this.allLogos.push(logoAll);
            this.resetLogoAndClose();
        },
        addLogo: function(logo) {
            let logoCopy = JSON.parse(JSON.stringify(logo));
            this.assignDefaultBackground(logoCopy);
            this.pageLogos.push(logoCopy);
            this.addingLogo = true;
            this.editLogoBackground(logoCopy);
        },
        assignDefaultBackground: function(logo)
        {
            Object.assign(logo, {pivot: {preferences: {'background-color': ''}}});
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
        cancelEditLogoBackground() {
            if (this.addingLogo) {
                this.removeLogo(this.logo);
                this.addingLogo = false;
            }
            
            this.toggleBgForm();
        },
        editLogoSpecs(logo) {
            this.logo = logo;
            this.toggleSpecForm();
        },
        toggleBgForm() {
            this.displayBgForm = ! this.displayBgForm;
        },
        toggleSpecForm() {
            this.displaySpecForm = ! this.displaySpecForm;
        },
        cancelChanges() {
            this.$emit('cancel');
        },
        saveChanges() {
            let params = this.pageLogos.map((l) => {
                return {id: l.id, hex: l.pivot.preferences['background-color']};
            });

            let form = new StyleguideForm({logo: params});

            form.on('success', () => {
                this.$emit('success');
            });

            form.submit(this.dataEndpoint);
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
    margin: 24px 0px;
}
</style>