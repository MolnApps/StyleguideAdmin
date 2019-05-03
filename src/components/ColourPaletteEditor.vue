<template>
    <div>
        <!-- Page colours -->
        <div class="page Colour__container">
            <div v-for="colour in pageColours" :data-id="colour.id" class="Colour">
                <div v-text="colour.title" :style="'background-color:' + colour.hex" class="Colour__fill"></div>
                <div class="Colour__actions">
                    <span href="#" @click.prevent="removeColour(colour.id)" class="del Colour__action">Remove</span>
                    <span href="#" @click.prevent="editColour(colour)" class="edit Colour__action">Edit</span>
                </div>
            </div>
        </div>
        <!-- Form -->
        <form id="colourForm" @submit.prevent="submit" v-if="displayForm" class="Form">
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
                <button id="cancelAdd" @click="resetFormAndClose" class="Button Button--secondary">Cancel</button>
                <button id="save" @click="saveColour" class="Button Button--primary">Save</button>
            </div>
        </form>
        <!-- All colours -->
        <div class="all Colour__container">
            <div v-for="colour in allColours" v-if="! isInPalette(colour)" class="Colour Colour--small">
                <div v-text="colour.title" :style="'background-color:' + colour.hex" class="Colour__fill"></div>
            </div>
            <button id="add" @click="toggleForm" v-if="! displayForm" class="Button Button--primary">Add</button>
        </div>
        <div class="Actions">
            <button id="cancel" @click="cancelChanges" class="Button Button--secondary">Cancel</button>
            <button id="persist" @click="saveChanges" class="Button Button--primary">Save changes</button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import StyleguideForm from './../StyleguideForm.js'
export default {
    props: ['dataPageColours', 'dataAllColours', 'dataEndpoint'],
    data() {
        return {
            pageColours: this.dataPageColours,
            allColours: this.dataAllColours,
            displayForm: false,
            form: null,
            changesForm: new StyleguideForm({foo: 'bar'})
        }
    },
    created() {
        this.resetForm();
    },
    methods: {
        isInPalette: function(colour) {
            return this.pageColours.filter((c) => {
                return c.id == colour.id;
            }).length > 0;
        },
        toggleForm: function() {
            this.displayForm = ! this.displayForm;
        },
        saveColour: function() {
            let originalColourId = this.eraseFormId();

            this.form.on('success', (data) => {
                this.removeColour(originalColourId);
                this.pageColours.push(data.record);
                this.allColours.push(data.record);
                this.resetFormAndClose();

                this.$emit('success', this.form.data());
            });

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
        resetFormAndClose: function() {
            this.resetForm();
            this.toggleForm();
        },
        resetForm: function() {
            this.form = new StyleguideForm({
                title: '',
                hex: '',
                rgb: '',
                cmyk: '',
                pantone: '',
                id: ''
            });
        },
        removeColour: function(id) {
            this.pageColours = this.pageColours.filter((c) => {
                return c.id != id;
            });
        },
        editColour: function(colour) {
            this.form = new StyleguideForm(colour);
            this.toggleForm();
        },
        saveChanges: function() {
            this.changesForm.on('success', () => {
                this.$emit('success');
            });

            this.changesForm.submit(this.dataEndpoint);
        },
        cancelChanges: function() {
            this.$emit('cancel');
        }
    }
}
</script>
<style scoped lang="scss">
.Colour__container {
    display: flex;
    justify-content: center;
    padding: 12px;
}
.Colour {
    background: #fff;
    display: flex;
    flex-flow: column;
    margin: 0px 12px;
}
.Colour--small {
    margin: 0px 6px;
}
.Colour__fill {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.Colour--small .Colour__fill {
    width: 50px;
    height: 50px;
    font-size: 10px;
}
.Colour__actions {
    display: flex;
    justify-content: center;
}
.Colour__action {
    font-size: 10px;
    color: #ccc;
    margin: 6px;
    cursor: pointer;
}
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
.Actions {
    display: flex;
}
.Actions .Button {
    flex: 1;
    margin: 0px 12px;
}
.Actions .Button:first-child {
    margin-left: 0px;
}
.Actions .Button:last-child {
    margin-right: 0px;
}
.Button {
    border-radius: 5px;
    padding: 12px 25px;
}
.Button--primary {
    background: magenta;
}
.Button--secondary {
    background: #ccc;
}
</style>