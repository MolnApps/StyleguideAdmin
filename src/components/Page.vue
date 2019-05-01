<template>
    <div>
        <div v-if="! editing">
            <h1 v-text="page.title"></h1>
            <p v-text="page.body"></p>
            <button id="edit" @click="toggle">Edit</button>
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