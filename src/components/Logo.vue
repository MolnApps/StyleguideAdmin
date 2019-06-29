<template>
    <div 
        :data-id="logo.id" 
        :data-background="background" 
        @click="$emit('click', logo)"
        class="PageItem" 
    >
        <div 
            :style="'background-color: ' + background" 
            class="PageItem__fill PageItem__fill--noHeight PageItem__fill--withPadding"
        >
            <img :src="logo.url" class="PageItem__image" />
        </div>
        <span v-if="displayTitle" v-text="logo.title" class="PageItem__title"></span>
        <div class="Actions Actions--small" v-if="editableBg">
            <btn class="del" size="xs" type="secondary" @click="$emit('remove', logo)">Remove</btn>
            <btn class="edit" size="xs" type="secondary" @click="$emit('edit', logo)">Edit</btn>
        </div>
        <div class="Actions Actions--small" v-if="editableSpec">
            <btn class="edit" size="xs" type="secondary" @click="$emit('edit-spec', logo)">Edit</btn>
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