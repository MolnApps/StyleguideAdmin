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
                    :key="colour.id"
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
        <confirm-modal 
            name="remove-colour-modal" 
            title="colour" 
            @confirm="confirmRemoveLibraryColour"
        ></confirm-modal>
    </div>
</template>

<script>
import StyleguideForm from '@/StyleguideForm.js'
import RemoveFromLibraryForm from '@/RemoveFromLibraryForm.js';
import ConfirmModal from '@/modals/ConfirmModal.vue'
import ColourForm from './ColourForm.vue'
import Colour from './Colour.vue'
import Btn from './Btn.vue'
import Draggable from 'vuedraggable'
export default {
    components: {Btn, ColourForm, Colour, Draggable, ConfirmModal},
    props: {
        dataPage: {type:Object},
        dataEndpoint: {type: String}, 
        dataPageEndpoint: {type: String},
        dataLiveUpdate: {type:Boolean, default: true}
    },
    data() {
        return {
            displayForm: false,
            removeForm: false,
            displayModal: false,
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
            return this.$store.getters['colours/pageHas']({page: this.dataPage, record: colour});
        },
        addPageColour: function(colour) {
            this.$store.dispatch('colours/addToPage', {page: this.dataPage, record: colour});
        },
        removePageColour: function(colour) {
            this.$store.dispatch('colours/removeFromPage', {page: this.dataPage, record: colour});
        },
        editPageColour: function(colour) {
            this.colourId = colour.id;
            this.colour = JSON.parse(JSON.stringify(colour));
            this.colour.id = null;
            this.toggleForm();
        },
        addLibraryColour: function(colour) {
            this.$store.dispatch('colours/add', colour);
        },
        editLibraryColour: function(colour) {
            this.editingLibraryColour = true;
            this.colour = colour;
            this.toggleForm();
        },
        removeLibraryColour: function(colour) {
            this.removeForm = new RemoveFromLibraryForm(
                'colours', 
                'remove-colour-modal', 
                colour, 
                this
            );
        },
        confirmRemoveLibraryColour: function() {
            this.removeForm.submit(this.dataEndpoint);
        },
        overrideLibraryColour: function(record) {
            this.$store.dispatch('colours/overrideById', {id: this.colour.id, record: record});
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
                colour_id: this.$store.getters['colours/idsForPage'](this.dataPage)
            });

            form.on('success', (data) => {
                this.$emit('success');
                this.$emit('feedback', data.feedback);
            });

            form.submit(this.dataPageEndpoint);
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
    },
    computed: {
        allColours() {
            return this.$store.getters['colours/all'];
        },
        pageColours() {
            return this.$store.getters['colours/byPageSlug'](this.dataPage.slug);
        }
    }
}
</script>