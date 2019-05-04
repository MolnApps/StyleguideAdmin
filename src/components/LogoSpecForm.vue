<template>
    <div>
        <form id="logoSpecForm" class="Form">
            <h3 class="Form__title">Logo Specs</h3>
            <div class="Form__group">
                <input 
                    type="text" 
                    name="display_width" 
                    v-model="form.display_width" 
                    placeholder="e.g. 200px" 
                    class="Form__input" 
                />
                <input 
                    type="text" 
                    name="display_height" 
                    v-model="form.display_height" 
                    placeholder="e.g. 200px" 
                    class="Form__input" 
                />
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
            <div class="Form__group">
                <input 
                    type="text" 
                    name="space_x" 
                    v-model="form.space_x" 
                    placeholder="e.g. 30%" 
                    class="Form__input" 
                />
                <input 
                    type="text" 
                    name="space_y" 
                    v-model="form.space_y" 
                    placeholder="e.g. 30%" 
                    class="Form__input" 
                />
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
            <div class="Form__group">
                <input 
                    type="text" 
                    name="min_width" 
                    v-model="form.min_width" 
                    placeholder="e.g. 30px" 
                    class="Form__input" 
                />
                <input 
                    type="text" 
                    name="min_width_text" 
                    v-model="form.min_width_text" 
                    placeholder="e.g. 20mm" 
                    class="Form__input" 
                />
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
                <button id="cancel" @click="cancel">Cancel</button>
                <button id="save" @click="save">Save</button>
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
        onSuccess: function(data) {
            this.resetForm();
            this.$emit('success', {
                data: data
            });
        },
        resetForm: function() {
            this.form = new StyleguideForm(this.logo, [
                'display_width', 
                'display_height', 
                'space_x',
                'space_y',
                'min_width',
                'min_width_text'
            ]);
        }
    }
}
</script>