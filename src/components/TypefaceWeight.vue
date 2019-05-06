<template>
    <div class="Typeface__family">
        <div 
            v-for="weight in typefaceFamily.weights" 
            :key="typefaceFamily.id + '.' + weight.weight" 
            v-if="shouldDisplay(typefaceFamily.id, weight)"
            @click="$emit('add', {
                id: typefaceFamily.id, 
                weight: weight.weight
            })"
        >
            <div class="Typeface__weight">
                <span class="Typeface__sample" :style="'font-family: ' + typefaceFamily.title + '; font-weight: ' + weight.weight">Aa</span>
                <span class="Typeface__name">{{weight.name}}</span>
                <div class="Colour__actions" v-if="dataEditable">
                    <span 
                        @click="$emit('remove', {
                            id: typefaceFamily.id, 
                            weight: weight.weight
                        })"
                        class="del Colour__action"
                    >Remove</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
export default {
    props: ['dataTypefaceFamily', 'displayCallback', 'dataEditable'],
    data() {
        return {
            typefaceFamily: this.dataTypefaceFamily
        }
    },
    methods: {
        shouldDisplay: function(id, weight) {
            if (this.displayCallback) {
                return this.displayCallback(id, weight);
            }

            return weight.weight == this.typefaceFamily.pivot.preferences.weight;
        }
    }
}
</script>