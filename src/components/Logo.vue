<template>
    <div 
        :data-id="logo.id" 
        :data-background="background" 
        class="PageItem" 
    >
        <div 
            @click="$emit('click', logo)"
            :style="'background-color: ' + background" 
            class="add PageItem__fill PageItem__fill--noHeight PageItem__fill--withPadding"
        >
            <img :src="logo.url" :width="logo.width" :height="logo.height" class="PageItem__image" />
        </div>
        <span v-if="displayTitle" v-text="logo.title" class="PageItem__title"></span>
        <div class="Actions Actions--small" v-if="editableBg">
            <btn class="del" size="xs" type="secondary" @click="$emit('remove', logo)">Remove</btn>
            <btn class="edit" size="xs" type="secondary" @click="$emit('edit', logo)">Edit</btn>
        </div>
        <div class="Actions Actions--small" v-if="editableSpec">
            <btn class="edit" size="xs" type="secondary" @click="$emit('edit-spec', logo)">Edit specs</btn>
            <btn class="del" size="xs" type="secondary" @click="$emit('remove', logo)">Remove</btn>
        </div>
    </div>
</template>

<script>
import Btn from './Btn.vue'
export default {
    components: {Btn},
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
        },
        displayTitle: {
            default: true,
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