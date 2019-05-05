<template>
    <div>
        <div v-if="! display.typefaceFamilyForm">
            <div class="page TypefaceFamily__container">
                <typeface-weight 
                    v-for="family in pageTypefaceFamilies" 
                    v-if="pivotWeightExists(family)"
                    :key="'page' + family.id + '.' + family.pivot.preferences.weight"
                    :data-typeface-family="family"
                    :data-editable="true"
                    @remove="removeWeight"
                ></typeface-weight>
            </div>
            <div class="Actions">
                <button id="add" @click="toggleTypefaceFamilyForm" class="Button Button--primary">Add</button>
            </div>
            <div class="all TypefaceFamily__container">
                <div v-for="family in allTypefaceFamilies">
                    <typeface-weight 
                        :display-callback="weightNotInPage"
                        :data-typeface-family="family"
                         @add="addWeight"
                    ></typeface-weight>
                </div>
            </div>
            <div class="Actions">
                <button id="cancelChanges" @click="cancelChanges" class="Button Button--secondary">Cancel changes</button>
                <button id="saveChanges" @click="saveChanges" class="Button Button--primary">Save changes</button>
            </div>
        </div>
        <typeface-family-form 
            v-if="display.typefaceFamilyForm" 
            @success="toggleTypefaceFamilyForm"
            @cancel="toggleTypefaceFamilyForm"
        ></typeface-family-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import TypefaceWeight from './TypefaceWeight.vue';
import TypefaceFamilyForm from './TypefaceFamilyForm.vue';
export default {
    components: {TypefaceWeight, TypefaceFamilyForm},
    props: ['dataPageTypefaceFamilies', 'dataAllTypefaceFamilies', 'endpoint'],
    data() {
        return {
            pageTypefaceFamilies: this.dataPageTypefaceFamilies,
            allTypefaceFamilies: this.dataAllTypefaceFamilies,
            display: {
                typefaceFamilyForm: false
            }
        }
    },
    methods: {
        pivotWeightExists(family) {
            return this.allTypefaceFamilies.filter((t) => {
                return t.id == family.id;
            }).filter((t) => {
                return t.weights.filter((w) => {
                    return w.weight == family.pivot.preferences.weight;
                }).length > 0;
            }).length > 0;
        },
        weightNotInPage: function(id, weight) {
            return this.pageTypefaceFamilies.filter((f) => {
                return f.id == id && f.pivot.preferences.weight == weight.weight;
            }).length == 0;
        },
        toggleTypefaceFamilyForm: function() {
            this.display.typefaceFamilyForm = ! this.display.typefaceFamilyForm;
        },
        addWeight(data)
        {
            let typeface = this.allTypefaceFamilies.filter((t) => {
                return t.id == data.id;
            })[0];

            typeface = JSON.parse(JSON.stringify(typeface));

            Object.assign(typeface, {pivot: {preferences: {weight: data.weight}}})

            this.pageTypefaceFamilies.push(typeface);
        },
        removeWeight(data)
        {
            this.pageTypefaceFamilies = this.pageTypefaceFamilies.filter((t) => {
                return ! (t.id == data.id && t.pivot.preferences.weight == data.weight);
            });
        },
        saveChanges()
        {
            let data = this.pageTypefaceFamilies.map((t) => {
                return {id: t.id, weight: t.pivot.preferences.weight};
            });
            let form = new StyleguideForm({
                typeface: data
            });
            form.on('success', () => {
                this.$emit('success');
            });
            form.submit(this.endpoint);
        },
        cancelChanges()
        {
            this.$emit('cancel');
        }
    }
}
</script>
<style lang="scss">
.TypefaceFamily__container {
    display: flex;
    justify-content: center;
    padding: 25px;
    margin: 25px;
    border: 1px solid #ccc;
}
</style>