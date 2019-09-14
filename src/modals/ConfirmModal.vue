<template>
    <modal :name="name" class="vue-dialog" height="auto">
        <div class="p-8 pb-0 text-center">
            <h2 class="text-blue">Remove item</h2>
            <p class="text-lg text-grey-darker pt-2">Are you sure you want to remove this item?</p>
        </div>
        <div class="Actions p-4">
            <btn @click="close" size="s" type="secondary">Cancel</btn>
            <btn @click="confirm" size="s" type="danger">Proceed</btn>
        </div>
    </modal>
</template>
<script>
import Btn from '@/components/Btn.vue';

export default {
    components: {Btn},
    name: 'Confirm_Modal',
    props: {
        'title': {
            default: 'item'
        },
        'name': {
            default: 'confirm-modal'
        }
    },
    computed: {
        buttonStyle () {
            return {flex: `1 1 ${50}%`}
        }
    },
    methods: {
        close () {
            this.$emit('cancel');
            this.$modal.hide(this.name)
        },
        confirm () {
            this.$emit('confirm');
            this.close();
        }
    }
}
</script>