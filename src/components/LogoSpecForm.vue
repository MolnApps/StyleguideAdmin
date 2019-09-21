<template>
    <div class="Container">
        <form id="logoSpecForm" class="Form" @submit.prevent="">
            <h3 class="Title">Logo Specs</h3>
            <div class="flex">
                <logo-safety :logo="dataLogo" :logo-specs="form" class="flex-1"></logo-safety>
                <logo-size :logo="dataLogo" :logo-specs="form" class="flex-1"></logo-size>
            </div>
            <div class="Form__group Form__group--border">
                <div class="Form__row Form__row--noMargin">
                    <strong>Display size</strong>
                </div>
                <div class="Form__row Form__row--noMargin">
                    <input 
                        type="text" 
                        name="display_width" 
                        v-model="form.display_width" 
                        placeholder="Width (e.g. 200px)" 
                        class="Form__input" 
                    />
                </div>
                <div class="Form__row Form__row--noMargin">
                    <input 
                        type="text" 
                        name="display_height" 
                        v-model="form.display_height" 
                        placeholder="Height (e.g. 200px)" 
                        class="Form__input" 
                    />
                </div>
            </div>
            <p 
                v-if="form.errors.display_width" 
                v-for="error in form.errors.display_width" 
                v-text="error"
            ></p>
            <p 
                v-if="form.errors.display_height" 
                v-for="error in form.errors.display_height" 
                v-text="error"
            ></p>
            <div class="Form__group Form__group--border">
                <div class="Form__row Form__row--noMargin">
                    <strong>Safety areas</strong>
                </div>
                <div class="Form__row Form__row--noMargin">
                    <input 
                        type="text" 
                        name="space_x" 
                        v-model="form.space_x" 
                        placeholder="Horizontal Spacing (e.g. 30%)" 
                        class="Form__input" 
                    />
                </div>
                <div class="Form__row Form__row--noMargin">
                    <input 
                        type="text" 
                        name="space_y" 
                        v-model="form.space_y" 
                        placeholder="Vertical Spacing (e.g. 30%)" 
                        class="Form__input" 
                    />
                </div>
            </div>
            <p 
                v-if="form.errors.space_x" 
                v-for="error in form.errors.space_x" 
                v-text="error"
            ></p>
            <p 
                v-if="form.errors.space_y" 
                v-for="error in form.errors.space_y" 
                v-text="error"
            ></p>
            <div class="Form__group Form__group--border">
                <div class="Form__row Form__row--noMargin">
                    <strong>Minimum size</strong>
                </div>
                <div class="Form__row Form__row--noMargin">
                    <input 
                        type="text" 
                        name="min_width" 
                        v-model="form.min_width" 
                        placeholder="Minimum display width (e.g. 30px)" 
                        class="Form__input" 
                    />
                </div>
                <div class="Form__row Form__row--noMargin">
                    <input 
                        type="text" 
                        name="min_width_text" 
                        v-model="form.min_width_text" 
                        placeholder="Minimum width text (e.g. 20mm)" 
                        class="Form__input" 
                    />
                </div>
            </div>
            <p 
                v-if="form.errors.min_width" 
                v-for="error in form.errors.min_width" 
                v-text="error"
            ></p>
            <p 
                v-if="form.errors.min_width_text" 
                v-for="error in form.errors.min_width_text" 
                v-text="error"
            ></p>
            <div class="Actions">
                <btn id="cancel" ref="cancel" @click="cancel" type="secondary">Cancel</btn>
                <btn id="save" ref="save" @click="save" asynch>Save</btn>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import LogoSafety from './LogoSafety.vue'
import LogoSize from './LogoSize.vue'
import Btn from './Btn.vue'
import bus from '@/bus.js'
export default {
    components: {Btn, LogoSafety, LogoSize},
    props: ['dataLogo', 'dataEndpoint'],
    data() {
        return {
            form: new StyleguideForm(this.dataLogo, [
                'display_width', 
                'display_height', 
                'space_x',
                'space_y',
                'min_width',
                'min_width_text'
            ])
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
        onSuccess: function(data) {
            this.$emit('success', {data: data});
            bus.$emit('feedback', data.feedback);
        }
    }
}
</script>