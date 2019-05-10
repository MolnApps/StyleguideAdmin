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
        <div class="PageItem__actions" v-if="editable">
            <span 
                @click.prevent="$emit('remove', colour)" 
                class="del PageItem__action"
            >Remove</span>
            <span 
                @click.prevent="$emit('edit', colour)" 
                class="edit PageItem__action"
            >Edit</span>
        </div>
    </div>
</template>

<script>
export default {
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