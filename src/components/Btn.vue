<template>
    <button 
        class="Button" 
        @click="handleClick"
        :class="'Button--' + type + ' Button--' + size + ' Button--' + modifier"
    >
        <slot></slot>
    </button>
</template>

<script>
import bus from './../bus';
export default {
    props: {
        type: {default: 'primary'},
        size: {default: 'xl'},
        asynch: Boolean
    },
    data() {
        return {
            isLoading: false
        }
    },
    created() {
        bus.$on('done', this.resetStatus.bind(this));
    },
    computed: {
        modifier: function() {
            return this.isLoading
                ? 'loading' 
                : this.$store.getters['ui/status'];
        },
        isLocked: function() {
            return this.$store.getters['ui/isLocked'];
        }
    },
    methods: {
        handleClick: function() {
            if (this.isLocked) {
                return;
            }

            if (this.asynch) {
                this.isLoading = true;
                this.$store.dispatch('ui/disable');
            }
            
            this.$emit('click');
        },
        resetStatus: function() {
            this.isLoading = false;
            this.$store.dispatch('ui/enable');
        }
    }
}
</script>