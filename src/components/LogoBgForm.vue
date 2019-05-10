<template>
    <div class="Container">
        <form id="logoBgForm" class="Form" @submit.prevent="">
            <h3 class="Title">Background</h3>
            <input 
                type="text" 
                name="hex" 
                v-model="logo.pivot.preferences['background-color']" 
                placeholder="#hex" 
                class="Form__input" 
            />
            <div class="Actions">
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
    props: ['dataLogo'],
    data() {
        return {
            logo: this.dataLogo,
            originalBgColour: null
        }
    },
    created() {
        this.originalBgColour = this.logo.pivot.preferences['background-color'];
    },
    methods: {
        save: function(data) {
            this.$emit('success');
        },
        cancel: function(data) {
            this.logo.pivot.preferences['background-color'] = this.originalBgColour;
            this.$emit('cancel');
        }
    }
}
</script>