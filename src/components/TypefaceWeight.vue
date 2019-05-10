<template>
    <div class="flex">
        <div 
            v-for="weight in typefaceFamily.weights" 
            :key="typefaceFamily.id + '.' + weight.weight" 
            v-if="shouldDisplay(typefaceFamily.id, weight)"
            @click="onAdd(weight)"
            class="PageItem"
        >
            <div class="PageItem__fill">
                <span 
                    class="Typeface__sample" 
                    :style="getStyle(weight)"
                    >Aa</span>
            </div>
            <span class="PageItem__title">{{weight.name}}</span>
            <div class="PageItem__actions" v-if="dataEditable">
                <span 
                    @click="onRemove(weight)"
                    class="del PageItem__action"
                >Remove</span>
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
        },
        getStyle(weight) {
            return 'font-family: ' + this.typefaceFamily.title + '; '
                + 'font-weight: ' + weight.weight + ';';
        },
        onAdd(weight) {
            this.$emit('add', {
                id: this.typefaceFamily.id, 
                weight: weight.weight
            })
        },
        onRemove(weight) {
            this.$emit('remove', {
                id: this.typefaceFamily.id, 
                weight: weight.weight
            });
        }
    }
}
</script>