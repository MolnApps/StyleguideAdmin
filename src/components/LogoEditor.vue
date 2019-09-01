<template>
    <div class="Container">
        <div v-if="! displayForm && ! displayBgForm && ! displaySpecForm">
            <h3 class="Title">Logos</h3>
        	<draggable 
                :list="pageLogos" 
                class="page PageItem__container"
            >
                <logo 
                    v-for="(logo, index) in pageLogos" 
                    :logo="logo" 
                    :editable-bg="true" 
                    :key="logo.id + logo.pivot.preferences['background-color']"
                    @remove="removeLogo"
                    @edit="editLogoBackground"
                ></logo>
                <btn ref="add" size="m" @click="toggleForm">Add new logo</btn>
            </draggable>
            <h3 class="Title Title--small">Library</h3>
            <div class="all PageItem__container">
            	<logo 
                    v-for="(logo, index) in allLogos" 
                    :logo="logo" 
                    :key="index"
                    :editable-spec="true"
                    class="PageItem--small"
                    @click="addLogo"
                    @edit-spec="editLogoSpecs"
                ></logo>
            </div>
            <div class="Actions">
                <btn ref="cancelChanges" type="secondary" @click="cancelChanges">Cancel changes</btn>
                <btn ref="saveChanges" @click="saveChanges" asynch>Save changes</btn>
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
import StyleguideForm from './../StyleguideForm.js'
import Logo from './Logo.vue'
import LogoForm from './LogoForm.vue'
import LogoBgForm from './LogoBgForm.vue'
import LogoSpecForm from './LogoSpecForm.vue'
import Draggable from 'vuedraggable'
import Btn from './Btn.vue'
export default {
    components: {Btn, Logo, LogoForm, LogoBgForm, LogoSpecForm, Draggable},
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
                return {id: l.id, 'background-color': l.pivot.preferences['background-color']};
            });

            let form = new StyleguideForm({logo: params});

            form.on('success', (data) => {
                this.$emit('success');
                this.$emit('feedback', data.feedback);
            });

            form.submit(this.dataEndpoint);
        }
    }
}
</script>