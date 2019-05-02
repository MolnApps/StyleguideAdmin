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
            <input type="text" name="title" v-model="colour.title" />
            <p v-if="errors.title" v-for="error in errors.title" v-text="error"></p>
            <input type="text" name="hex" v-model="colour.hex" />
            <p v-if="errors.hex" v-for="error in errors.hex" v-text="error"></p>
            <input type="text" name="rgb" v-model="colour.rgb" />
            <p v-if="errors.rgb" v-for="error in errors.rgb" v-text="error"></p>
            <input type="text" name="cmyk" v-model="colour.cmyk" />
            <p v-if="errors.cmyk" v-for="error in errors.cmyk" v-text="error"></p>
            <input type="text" name="pantone" v-model="colour.pantone" />
            <p v-if="errors.pantone" v-for="error in errors.pantone" v-text="error"></p>
            <button id="save" @click="saveColour">Save</button>
        </form>
        <button id="add" @click="toggleForm" v-if="! displayForm">Add</button>
        <button id="persist" @click="saveChanges">Save changes</button>
        <button id="cancel" @click="cancelChanges">Cancel</button>
    </div>
</template>

<script>
import axios from 'axios'
export default {
    props: ['dataPageColours', 'dataAllColours', 'dataEndpoint'],
    data() {
        return {
            pageColours: this.dataPageColours,
            allColours: this.dataAllColours,
            displayForm: false,
            colour: {
                title: '',
                hex: '',
                rgb: '',
                cmyk: '',
                pantone: '',
                id: ''
            },
            errors: {}
        }
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
            if (this.colour.id) {
                this.colour.id = '';
            }

            axios.post(this.dataEndpoint, this.colour)
                .then(({data}) => {
                    this.pageColours.push(data.record);
                    this.allColours.push(data.record);
                    this.resetColour();
                    this.toggleForm();
                })
                .catch((error) => {
                    this.errors = error.response.data.errors;
                });
        },
        resetColour: function() {
            this.colour = {
                title: '',
                hex: '',
                rgb: '',
                cmyk: '',
                pantone: '',
                id: ''
            };
        },
        removeColour: function(id) {
            this.pageColours = this.pageColours.filter((c) => {
                return c.id != id;
            });
        },
        editColour: function(colour) {
            this.colour = colour;
            this.toggleForm();
        },
        saveChanges: function() {
            axios.post(this.dataEndpoint, {foo: 'bar'})
                .then((response) => {
                    this.$emit('success');
                })
                .catch((errors) => {
                    
                });
        },
        cancelChanges: function() {
            this.$emit('cancel');
        }
    }
}
</script>