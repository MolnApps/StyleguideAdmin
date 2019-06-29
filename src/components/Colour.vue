<template>
    <div 
        :data-id="colour.id" 
        class="PageItem" 
        :class="modifierClass" 
        @click="$emit('click', colour)"
    >
        <div 
            v-text="colour.title" 
            :style="backgroundColour" 
            class="PageItem__fill PageItem__fill--circle"
        ></div>
        <div class="Actions Actions--small" v-if="editable">
            <btn class="del" @click="$emit('remove', colour)" type="secondary" size="xs">Remove</btn>
            <btn class="edit" @click="$emit('edit', colour)" type="secondary" size="xs">Edit</btn>
        </div>
    </div>
</template>

<script>
import Btn from './Btn.vue'
export default {
    components: {Btn},
    props: ['dataColour', 'dataEditable', 'dataMod'],
    data() {
        return {
            colour: this.dataColour,
            editable: this.dataEditable
        }
    },
    computed: {
        backgroundColour: function() {
            return 'background-color:' + this.colour.hex;
        },
        modifierClass: function() {
            return this.dataMod ? 'PageItem--' + this.dataMod : '';
        }
    }
}
</script>