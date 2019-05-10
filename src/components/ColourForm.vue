<template>
    <div class="Container">
        <form id="colourForm" class="Form">
            <h3 class="Title">Colour</h3>
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
            <div class="Actions">
                <button 
                    id="cancelAdd" 
                    @click="onCancel" 
                    class="Button Button--secondary Button--xl"
                >Cancel</button>
                <button 
                    id="save" 
                    @click="saveColour" 
                    class="Button Button--primary Button--xl"
                >Save</button>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
export default {
    props: ['dataColour', 'dataEndpoint'],
    data() {
        return {
            colour: this.dataColour,
            colourId: null,
            form: null
        }
    },
    created() {
        this.resetForm();
    },
    methods: {
        saveColour: function() {
            this.colourId = this.eraseFormId();

            this.form.on('success', this.onSuccess.bind(this));

            this.form.submit(this.dataEndpoint);
        },
        eraseFormId: function() {
            let id;

            if (this.form.id) {
                id = this.form.id;
                this.form.id = '';
            }
            
            return id;
        },
        onCancel: function() {
            this.resetForm();
            this.$emit('cancel');
        },
        onSuccess: function(data) {
            this.resetForm();
            this.$emit('success', {
                data: data, 
                id: this.colourId
            });
        },
        resetForm: function() {
            this.form = new StyleguideForm(this.colour);
        }
    }
}
</script>