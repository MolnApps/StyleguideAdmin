<template>
    <div>
        <form id="logoBgForm" class="Form" @submit.prevent="">
            <h3 class="Form__title">Background</h3>
            <input 
                type="text" 
                name="hex" 
                v-model="logo.pivot.preferences['background-color']" 
                placeholder="#hex" 
                class="Form__input" 
            />
            <div class="Actions">
                <button id="save" @click="save" class="Button Button--primary">Save</button>
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
            logo: this.dataLogo
        }
    },
    methods: {
        save: function(data) {
            this.$emit('success');
        }
    }
}
</script>