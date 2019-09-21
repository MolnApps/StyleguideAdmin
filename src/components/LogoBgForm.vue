<template>
    <div class="Container">
        <form id="logoBgForm" class="Form">
            <h3 class="Title">Background</h3>
            <div class="Form__row">
                <div class="flex items-stretch justify-center">
                    <logo 
                        :logo="logo" 
                        :display-title="false" 
                        class="PageItem--noMargin PageItem--full"
                    ></logo>
                    <sketch-picker 
                        v-model="logo.pivot.preferences['background-color']" 
                        :presetColors="[ '#ff0000', '#00ff00', '#0000ff']" 
                        @input="onPickColour"
                    ></sketch-picker>
                </div>
            </div>
            <div class="Form__row">
                <input 
                    type="text" 
                    name="hex" 
                    v-model="logo.pivot.preferences['background-color']" 
                    placeholder="#hex" 
                    class="Form__input" 
                />
            </div>
            <div class="Actions Actions--noMargin">
                <btn id="cancel" ref="cancel" type="secondary" @click="cancel">Cancel</btn>
                <btn id="save" ref="save" @click="save">Save</btn>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import Logo from './Logo.vue'
import {Sketch} from 'vue-color'
import Btn from './Btn.vue'
export default {
    components: {
        'logo': Logo, 
        'sketch-picker': Sketch,
        'btn': Btn
    },
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
        },
        onPickColour(value) {
            this.logo.pivot.preferences['background-color'] = value.hex;
        }
    }
}
</script>