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
<style lang="scss">
.Colour__container {
    display: flex;
    justify-content: center;
    padding: 12px;
}
.Colour {
    background: #fff;
    display: flex;
    flex-flow: column;
    margin: 0px 12px;
}
.Colour--small {
    margin: 0px 6px;
}
.Colour__fill {
    width: 100px;
    height: 100px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.Colour--small .Colour__fill {
    width: 50px;
    height: 50px;
    font-size: 10px;
}
.Colour__actions {
    display: flex;
    justify-content: center;
}
.Colour__action {
    font-size: 10px;
    color: #ccc;
    margin: 6px;
    cursor: pointer;
}
</style>