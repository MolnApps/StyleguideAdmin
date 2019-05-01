<template>
    <div>
        <div v-if="! editing" class="p-16">
            <div class="flex border-0 border-t-2 border-grey pt-2 mb-6">
                <h2 v-text="page.title" class="flex-1"></h2>
                <button id="edit" @click="toggle" class="btn btn-blue">Edit</button>
            </div>
            <p v-text="page.body" class="w-3/4"></p>
        </div>
        <page-form 
            v-if="editing" 
            :data-page="dataPage" 
            :data-endpoint="dataEndpoint"
            @success="refresh" 
            @cancel="toggle"
        ></page-form>
    </div>
</template>

<script>
import PageForm from './PageForm.vue';
export default {
    components: {
        PageForm
    },
    props: ['dataPage', 'dataEndpoint'],
    data() {
        return {
            page: this.dataPage,
            editing: false
        }
    },
    methods: {
        refresh: function(data) {
            this.page = data;
            this.toggle();
        },
        toggle: function() {
            this.editing = ! this.editing;
        }
    }
}
</script>