<template>
    <div class="Container">
        <div v-if="! display.typefaceFamilyForm">
            <h3 class="Title">Typefaces</h3>
            <div class="page PageItem__container">
                <typeface-weight 
                    v-for="family in pageTypefaceFamilies" 
                    v-if="pivotWeightExists(family)"
                    :key="'page' + family.id + '.' + family.pivot.preferences.weight"
                    :data-typeface-family="family"
                    :data-editable="true"
                    @remove="removeWeight"
                ></typeface-weight>
            </div>
            <h3 class="Title Title--small">Library</h3>
            <div class="all PageItem__container">
                <div 
                    v-for="family in allTypefaceFamilies" 
                    :key="family.id"
                    v-if="hasWeightsNotInPage(family)"
                    :data-id="family.id"
                    class="PageItem"
                >
                    <typeface-weight 
                        :display-callback="weightNotInPage"
                        :data-typeface-family="family"
                         @add="addWeight"
                    ></typeface-weight>
                    <div class="Actions Actions--small">
                        <btn 
                            class="edit" 
                            @click="editTypefaceFamily(family)"
                            type="secondary"
                            size="xs"
                        >Edit</btn>
                        <btn 
                            class="del" 
                            @click="removeTypefaceFamily(family)"
                            type="secondary"
                            size="xs"
                        >Remove</btn>
                    </div>
                </div>
                <btn ref="add" @click="addTypefaceFamily" size="m">Add</btn>
            </div>
            <div class="Actions">
                <btn ref="cancelChanges" @click="cancelChanges" type="secondary">Cancel changes</btn>
                <btn ref="saveChanges" @click="saveChanges" asynch>Save changes</btn>
            </div>
        </div>
        <typeface-family-form 
            v-if="display.typefaceFamilyForm" 
            :data-typeface-family="typefaceFamily"
            :data-endpoint="dataEndpoint + '/' + typefaceFamily.id"
            @success="onSaveTypefaceFamilyForm"
            @cancel="toggleTypefaceFamilyForm"
        ></typeface-family-form>
        <confirm-modal 
            name="remove-typeface-family-modal" 
            title="typeface family" 
            @confirm="confirmRemoveTypefaceFamily" />
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import RemoveFromLibraryForm from './../RemoveFromLibraryForm.js'
import TypefaceWeight from './TypefaceWeight.vue'
import TypefaceFamilyForm from './TypefaceFamilyForm.vue'
import Btn from './Btn.vue'
import ConfirmModal from './../modals/ConfirmModal.vue'
import bus from './../bus.js'
export default {
    components: {Btn, TypefaceWeight, TypefaceFamilyForm, ConfirmModal},
    props: [
        'dataPage',
        'dataPageEndpoint',
        'dataEndpoint'
    ],
    data() {
        return {
            typefaceFamily: null,
            display: {
                typefaceFamilyForm: false
            },
            form: new StyleguideForm({}),
            removeForm: null
        }
    },
    methods: {
        pivotWeightExists(family) {
            return this.$store.getters['typefaces/allById'](family.id)
                .filter((t) => {
                    return t.weights.filter((w) => {
                        return w.weight == family.pivot.preferences.weight;
                    }).length > 0;
                }).length > 0;
        },
        hasWeightsNotInPage: function(family) {
            return family.weights.filter((w) => {
                return this.weightNotInPage(family.id, w);
            }).length > 0;
        },
        weightNotInPage: function(id, weight) {
            return ! this.$store.getters['typefaces/pageHasWithPivot']({
                page: this.dataPage, 
                record: {'id': id, pivot: {preferences: weight}},
                pivotProperty: 'weight',
            });
        },
        onSaveTypefaceFamilyForm: function(record) {
            this.$store.dispatch('typefaces/overrideById', {id: record.id, record: record});

            this.toggleTypefaceFamilyForm();
        },
        toggleTypefaceFamilyForm: function() {
            this.display.typefaceFamilyForm = ! this.display.typefaceFamilyForm;
        },
        addTypefaceFamily() {
            this.typefaceFamily = {
                id: '', 
                title: '', 
                webfont_url: '', 
                foundry_url: '', 
                weights: [{name: '', weigth: ''}]
            };
            this.toggleTypefaceFamilyForm();
        },
        editTypefaceFamily(family) {
            this.typefaceFamily = JSON.parse(JSON.stringify(family)); 
            this.toggleTypefaceFamilyForm();
        },
        addWeight(data) {
            let typeface = this.$store.getters['typefaces/byId'](data.id);

            typeface = JSON.parse(JSON.stringify(typeface));

            Object.assign(typeface, {pivot: {preferences: {weight: data.weight}}})

            this.$store.dispatch('typefaces/addToPage', {
                page: this.dataPage, 
                record: typeface
            });
        },
        removeWeight(data) {
            this.$store.dispatch('typefaces/removeFromPageByIdAndPivot', {
                page: this.dataPage, 
                record: {id: data.id, pivot: {preferences: data}}, 
                pivotProperty: 'weight'
            });
        },
        saveChanges() {
            this.form = new StyleguideForm({
                typeface: this.$store.getters['typefaces/idsAndPivotForPage']({
                    page: this.dataPage,
                    pivotProperty: 'weight'
                })
            });
            this.form.on('success', this.onSuccess.bind(this));
            this.form.submit(this.dataPageEndpoint);
        },
        onSuccess() {
            this.$emit('success');
            bus.$emit('feedback', this.form.feedback);
        },
        cancelChanges() {
            this.$emit('cancel');
        },
        removeTypefaceFamily(typefaceFamily) {
            this.removeForm = new RemoveFromLibraryForm(
                'typefaces', 
                'remove-typeface-family-modal', 
                typefaceFamily, 
                this
            );
        },
        confirmRemoveTypefaceFamily() {
            this.removeForm.submit(this.dataEndpoint);
        }
    },
    computed: {
        allTypefaceFamilies() {
            return this.$store.getters['typefaces/all'];
        },
        pageTypefaceFamilies() {
            return this.$store.getters['typefaces/byPageSlug'](this.dataPage.slug);
        }
    }
}
</script>