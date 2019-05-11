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
        <div class="PageItem__actions" v-if="editableBg">
            <span class="del PageItem__action" @click="$emit('remove', logo)">Remove</span>
            <span class="edit PageItem__action" @click="$emit('edit', logo)">Edit</span>
        </div>
        <div class="PageItem__actions" v-if="editableSpec">
            <span class="edit PageItem__action" @click="$emit('edit-spec', logo)">Edit</span>
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