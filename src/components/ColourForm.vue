<template>
    <div class="Container">
        <h3 class="Title">Colour</h3>
        <div class="flex">
            <form id="colourForm" class="Form flex-1 mr-16" @submit.prevent="">
                <div class="Form__row">
                    <input 
                        type="text" 
                        name="title" 
                        v-model="form.title" 
                        placeholder="Title" 
                        class="Form__input" />
                    <p v-for="error in form.errors.title" v-text="error"></p>
                </div>
                <div class="Form__row">
                    <input 
                        type="text" 
                        name="hex" 
                        v-model="form.hex"
                        @input="onInput" 
                        placeholder="Hex"
                        class="Form__input" />
                    <p v-for="error in form.errors.hex" v-text="error"></p>
                </div>
                <div class="Form__row">
                    <input 
                        type="text" 
                        name="rgb" 
                        v-model="form.rgb" 
                        placeholder="RGB"
                        class="Form__input" />
                    <p v-for="error in form.errors.rgb" v-text="error"></p>
                </div>
                <div class="Form__row">
                    <input 
                        type="text" 
                        name="cmyk" 
                        v-model="form.cmyk" 
                        placeholder="CMYK"
                        class="Form__input" />
                    <p v-for="error in form.errors.cmyk" v-text="error"></p>
                </div>
                <div class="Form__row">
                    <input 
                        type="text" 
                        name="pantone" 
                        v-model="form.pantone" 
                        placeholder="Pantone"
                        class="Form__input" />
                    <p v-for="error in form.errors.pantone" v-text="error"></p>
                </div>
                <div class="Form__row">
                    <label><input 
                        type="checkbox" 
                        id="liveUpdate" 
                        :checked="liveUpdate ? 'checked' : ''" 
                        @change="toggleLiveUpdate" 
                    />Live update</label>
                </div>
                <div class="Actions">
                    <button 
                        id="cancel" 
                        @click="onCancel" 
                        class="Button Button--secondary Button--xl"
                    >Cancel</button>
                    <button 
                        id="save" 
                        @click="onSave" 
                        class="Button Button--primary Button--xl"
                    >Save</button>
                </div>
            </form>
            <sketch-picker 
                :value="form.hex"  
                :preset-colors="[]"
                @input="onPickColour"
            ></sketch-picker>
        </div>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import hexToPantone from './../HexToPantone.js';
import chroma from 'chroma-js';
import colorNamer from 'color-namer';
import {Sketch} from 'vue-color';
export default {
    components: {
        'sketch-picker': Sketch
    },
    props: ['dataColour', 'dataEndpoint', 'dataLiveUpdate'],
    data() {
        return {
            colour: this.dataColour,
            liveUpdate: this.dataLiveUpdate,
            form: null
        }
    },
    created() {
        this.resetForm();
    },
    methods: {
        onSave: function() {
            this.form.on('success', this.onSuccess.bind(this));

            this.form.submit(this.dataEndpoint, this.colour);
        },
        onCancel: function() {
            this.resetForm();
            this.$emit('cancel');
        },
        onSuccess: function(data) {
            this.colour = data.record;
            this.resetForm();
            this.$emit('success', data.record);
        },
        resetForm: function() {
            this.form = new StyleguideForm(
                this.colour, 
                ['title', 'hex', 'rgb', 'cmyk', 'pantone']
            );
        },
        onInput: function() {
            if ( ! this.liveUpdate || ! this.form.hex) {
                return;
            }
            
            if ( ! this.colour.title) {
                let name = colorNamer(this.form.hex, { pick: ['ntc'] });
                this.form.title = name.ntc[0].name;
            }
            if ( ! this.colour.rgb) {
                this.form.rgb = chroma(this.form.hex).rgb().toString().split(',').join(' ');
            }
            if ( ! this.colour.cmyk) {
                this.form.cmyk = chroma(this.form.hex).cmyk().toString().split(',').map((c) => {
                    return parseInt(c * 100);
                }).join(' ');
            }
            if ( ! this.colour.pantone) {
                this.form.pantone = hexToPantone(this.form.hex);
            }
        },
        onPickColour: function(colour) {
            this.form.hex = colour.hex;
            this.onInput();
        },
        toggleLiveUpdate: function() {
            this.liveUpdate = ! this.liveUpdate;
            if (this.liveUpdate) {
                this.onInput();
            }
        }
    }
}
</script>