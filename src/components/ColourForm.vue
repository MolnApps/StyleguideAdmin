<template>
    <div>
        <form id="colourForm" class="Form">
            <h3 class="Form__title">Colour</h3>
            <input 
                type="text" 
                name="title" 
                v-model="form.title" 
                placeholder="Title" 
                class="Form__input" />
            <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            <input 
                type="text" 
                name="hex" 
                v-model="form.hex" 
                placeholder="Hex"
                class="Form__input" />
            <p v-if="form.errors.hex" v-for="error in form.errors.hex" v-text="error"></p>
            <input 
                type="text" 
                name="rgb" 
                v-model="form.rgb" 
                placeholder="RGB"
                class="Form__input" />
            <p v-if="form.errors.rgb" v-for="error in form.errors.rgb" v-text="error"></p>
            <input 
                type="text" 
                name="cmyk" 
                v-model="form.cmyk" 
                placeholder="CMYK"
                class="Form__input" />
            <p v-if="form.errors.cmyk" v-for="error in form.errors.cmyk" v-text="error"></p>
            <input 
                type="text" 
                name="pantone" 
                v-model="form.pantone" 
                placeholder="Pantone"
                class="Form__input" />
            <p v-if="form.errors.pantone" v-for="error in form.errors.pantone" v-text="error"></p>
            <div class="Actions">
                <button 
                    id="cancelAdd" 
                    @click="onCancel" 
                    class="Button Button--secondary"
                >Cancel</button>
                <button 
                    id="save" 
                    @click="saveColour" 
                    class="Button Button--primary"
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
<style lang="scss">
.Form {
    display: flex;
    flex-flow: column;
    padding: 50px;
    border: 1px solid #ccc;
    max-width: 360px;
    margin: 0 auto;
    border-radius: 5px;
    position: absolute;
    top: 24px;
    left: 0;
    right: 0;
    background: #fff;
}
.Form__title {
    text-align: center;
    padding: 0px 12px 12px;
}
.Form__input {
    border: 1px solid #ccc;
    margin-bottom: 12px;
    padding: 12px;
    border-radius: 5px;
}
</style>