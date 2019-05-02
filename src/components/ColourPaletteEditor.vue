<template>
    <div>
        <div class="page">
            <div v-for="colour in pageColours" :data-id="colour.id">
                <div v-text="colour.title"></div>
                <span href="#" @click.prevent="removeColour(colour.id)" class="del">Remove</span>
                <span href="#" @click.prevent="editColour(colour)" class="edit">Edit</span>
            </div>
        </div>
        <div class="all">
            <div v-for="colour in allColours" v-if="! isInPalette(colour)" v-text="colour.title"></div>
        </div>
        <form id="colourForm" @submit.prevent="submit" v-if="displayForm">
            <input type="text" name="title" v-model="form.title" />
            <p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
            <input type="text" name="hex" v-model="form.hex" />
            <p v-if="form.errors.hex" v-for="error in form.errors.hex" v-text="error"></p>
            <input type="text" name="rgb" v-model="form.rgb" />
            <p v-if="form.errors.rgb" v-for="error in form.errors.rgb" v-text="error"></p>
            <input type="text" name="cmyk" v-model="form.cmyk" />
            <p v-if="form.errors.cmyk" v-for="error in form.errors.cmyk" v-text="error"></p>
            <input type="text" name="pantone" v-model="form.pantone" />
            <p v-if="form.errors.pantone" v-for="error in form.errors.pantone" v-text="error"></p>
            <button id="cancelAdd" @click="resetFormAndClose">Cancel</button>
            <button id="save" @click="saveColour">Save</button>
        </form>
        <button id="add" @click="toggleForm" v-if="! displayForm">Add</button>
        <button id="persist" @click="saveChanges">Save changes</button>
        <button id="cancel" @click="cancelChanges">Cancel</button>
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