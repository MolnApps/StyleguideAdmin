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
        bus.$on('success', this.resetStatus.bind(this));
    },
    computed: {
        modifier: function() {
            return this.isLoading
                ? 'loading' 
                : this.$store.state.status;
        }
    },
    methods: {
        handleClick: function() {
            if (this.$store.state.status != 'enabled') {
                return;
            }

            if (this.asynch) {
                this.isLoading = true;
                this.$store.commit('DISABLE_BUTTONS');
            }
            
            this.$emit('click');
        },
        resetStatus: function() {
            this.isLoading = false;
            this.$store.commit('ENABLE_BUTTONS');
        }
    }
}
</script>