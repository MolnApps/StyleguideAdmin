<template>
    <div 
        :data-id="colour.id" 
        class="Colour" 
        :class="modifierClass" 
        @click="$emit('click', colour)"
    >
        <div v-text="colour.title" :style="backgroundColour" class="Colour__fill"></div>
        <div class="Colour__actions" v-if="editable">
            <span 
                @click.prevent="$emit('remove', colour)" 
                class="del Colour__action"
            >Remove</span>
            <span 
                @click.prevent="$emit('edit', colour)" 
                class="edit Colour__action"
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
            return this.dataMod ? 'Colour--' + this.dataMod : '';
        }
    }
}
</script>