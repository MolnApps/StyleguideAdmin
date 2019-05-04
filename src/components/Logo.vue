<template>
    <div 
        :data-id="logo.id" 
        :data-background="background" 
        @click="$emit('click', logo)"
        class="Logo" 
    >
        <div :style="'background-color: ' + background" class="Logo__background">
            <img :src="logo.url" />
        </div>
        <span v-text="logo.title"></span>
        <div class="Logo__actions" v-if="editableBg">
            <span class="del" @click="$emit('remove', logo)">Remove</span>
            <span class="edit" @click="$emit('edit', logo)">Edit</span>
        </div>
        <div class="Logo__actions" v-if="editableSpec">
            <span class="edit" @click="$emit('edit-spec', logo)">Edit</span>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        logo: {
            default: {},
            type: Object
        },
        editableBg: {
            default: false,
            type: Boolean
        },
        editableSpec: {
            default: false,
            type: Boolean
        }
    },
    computed: {
        background() {
            return this.logo.pivot ? this.logo.pivot.preferences['background-color'] : '';
        }
    }
}
</script>
<style lang="scss">
.Logo {
    display: flex;
    flex-flow: column;
    align-items: center;
    padding: 0px 6px;
    width: 160px;
}
.Logo__background {
    padding: 24px;
    background-color: #f6f6f6;
}
.Logo img {
    width: 100px;
    height: 100px;
    display: block;
}
.Logo span {
    text-align: center;
    word-wrap: wrap;
}
</style>