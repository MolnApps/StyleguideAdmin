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
            <div class="Actions Actions--small" v-if="dataEditable">
                <btn class="del" @click="onRemove(weight)" type="secondary" size="xs">Remove</btn>
            </div>
        </div>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import Btn from './Btn.vue'
export default {
    components: {Btn},
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