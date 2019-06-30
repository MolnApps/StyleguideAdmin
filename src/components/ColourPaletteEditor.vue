<template>
    <div class="Container">
        <div v-if="! displayForm">
            <h3 class="Title">Colour palette</h3>
            <!-- Page colours -->
            <draggable 
                :list="pageColours" 
                class="page PageItem__container"
            >
                <colour 
                    v-for="(colour, index) in pageColours" 
                    :key="colour.id"
                    :data-colour="colour"
                    :data-editable="true"
                    @remove="removePageColour"
                    @edit="editPageColour"
                ></colour>
            </draggable>
            <h3 class="Title Title--small">Library</h3>
            <!-- All colours -->
            <div class="all PageItem__container">
                <colour
                    v-for="(colour, index) in allColours"
                    v-if="! isInPalette(colour)"
                    :key="index"
                    :data-colour="colour"
                    :data-editable="true"
                    data-mod="small"
                    @add="addPageColour"
                    @edit="editLibraryColour"
                    @remove="removeLibraryColour"
                ></colour>
                <btn ref="add" size="m" @click="toggleForm">Add</btn>
            </div>
            <div class="Actions">
                <btn ref="cancelChanges" type="secondary" @click="cancelChanges">Cancel</btn>
                <btn ref="saveChanges" @click="saveChanges" asynch>Save changes</btn>
            </div>
        </div>
        <!-- Form -->
        <colour-form 
            v-if="displayForm" 
            :data-endpoint="dataEndpoint" 
            :data-colour="colour"
            :data-live-update="dataLiveUpdate"
            @success="onSaveColour"
            @cancel="resetAndClose"
        ></colour-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import ColourForm from './ColourForm.vue'
import Colour from './Colour.vue'
import Btn from './Btn.vue'
import Draggable from 'vuedraggable'
export default {
    components: {Btn, ColourForm, Colour, Draggable},
    props: {
        dataPageColours: {type: Array}, 
        dataAllColours: {type: Array}, 
        dataEndpoint: {type: String}, 
        dataPageEndpoint: {type: String},
        dataLiveUpdate: {type:Boolean, default: true}
    },
    data() {
        return {
            pageColours: this.dataPageColours,
            allColours: this.dataAllColours,
            pageEndpoint: this.dataPageEndpoint,
            displayForm: false,
            colour: {},
            colourId: null,
            editingLibraryColour: false
        }
    },
    created() {
        this.resetColour();
    },
    methods: {
        isInPalette: function(colour) {
            return this.pageColours.filter((c) => {
                return c.id == colour.id;
            }).length > 0;
        },
        addPageColour: function(colour) {
            this.pageColours.push(colour);
        },
        removePageColour: function(colour) {
            this.pageColours = this.pageColours.filter((c) => {
                return c.id != colour.id;
            });
        },
        editPageColour: function(colour) {
            this.colourId = colour.id;
            this.colour = JSON.parse(JSON.stringify(colour));
            this.colour.id = null;
            this.toggleForm();
        },
        addLibraryColour: function(colour) {
            this.allColours.push(colour);
        },
        editLibraryColour: function(colour) {
            this.editingLibraryColour = true;
            this.colour = colour;
            this.toggleForm();
        },
        removeLibraryColour: function(colour) {
            let form  = new StyleguideForm({_method: 'delete'});
            form.on('success', (response) => {
                this.$emit('feedback', form.feedback);
                this.allColours = this.allColours.filter((el) => {
                    return el.id !== colour.id;
                });
            });
            form.submit(this.dataEndpoint + '/' + colour.id);
        },
        overrideLibraryColour: function(record) {
            this.allColours = this.allColours.map((colour) => {
                return colour.id == this.colour.id ? record : colour;
            });
        },
        onSaveColour: function(record) {
            if (this.editingLibraryColour) {
                this.overrideLibraryColour(record);
                this.resetAndClose();
            } else {
                this.removePageColour({id: this.colourId});
                this.addPageColour(record);
                this.addLibraryColour(record);
                this.resetAndClose();
            }

            this.$emit('success', record);
        },
        saveChanges: function() {
            let form = new StyleguideForm({
                colour_id: this.pageColours.map((c) => {
                    return c.id;
                })
            });

            form.on('success', () => {
                this.$emit('success');
            });

            form.submit(this.pageEndpoint);
        },
        cancelChanges: function() {
            this.$emit('cancel');
        },
        resetAndClose: function() {
            this.resetColour();
            this.editingLibraryColour = false;
            this.colourId = null;
            this.toggleForm();
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
        toggleForm: function() {
            this.displayForm = ! this.displayForm;
        }
    }
}
</script>