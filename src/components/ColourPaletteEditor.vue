<template>
    <div>
        <!-- Page colours -->
        <div class="page Colour__container" v-if="! displayForm">
            <colour 
                v-for="colour in pageColours" 
                :data-colour="colour"
                :data-editable="true"
                @remove="removeColour"
                @edit="editColour"
            ></colour>
        </div>
        <!-- Form -->
        <colour-form 
            v-if="displayForm" 
            :data-endpoint="dataEndpoint" 
            :data-colour="colour"
            @success="onSaveColour"
            @cancel="resetColourAndClose"
        ></colour-form>
        <!-- All colours -->
        <div class="all Colour__container" v-if="! displayForm">
            <colour
                v-for="colour in allColours"
                v-if="! isInPalette(colour)"
                :data-colour="colour"
                :data-editable="false"
                data-mod="small"
                @click="addColour"
            ></colour>
            <button 
                id="add" 
                @click="toggleForm" 
                v-if="! displayForm" 
                class="Button Button--primary"
            >Add</button>
        </div>
        <div class="Actions" v-if="! displayForm">
            <button id="cancel" @click="cancelChanges" class="Button Button--secondary">Cancel</button>
            <button id="persist" @click="saveChanges" class="Button Button--primary">Save changes</button>
        </div>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import ColourForm from './ColourForm.vue'
import Colour from './Colour.vue'
export default {
    components: {ColourForm, Colour},
    props: [
        'dataPageColours', 
        'dataAllColours', 
        'dataEndpoint', 
        'dataPageEndpoint' 
    ],
    data() {
        return {
            pageColours: this.dataPageColours,
            allColours: this.dataAllColours,
            pageEndpoint: this.dataPageEndpoint,
            displayForm: false,
            colour: {}
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
        toggleForm: function() {
            this.displayForm = ! this.displayForm;
        },
        onSaveColour: function(data) {
            this.removeColour({id: data.id});
            this.pageColours.push(data.data.record);
            this.allColours.push(data.data.record);
            this.resetColourAndClose();

            this.$emit('success', data);
        },
        resetColourAndClose: function() {
            this.resetColour();
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
        addColour: function(colour) {
            this.pageColours.push(colour);
        },
        removeColour: function(colour) {
            this.pageColours = this.pageColours.filter((c) => {
                return c.id != colour.id;
            });
        },
        editColour: function(colour) {
            this.colour = colour;
            this.toggleForm();
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
        }
    }
}
</script>
<style lang="scss">
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