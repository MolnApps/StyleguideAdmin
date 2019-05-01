<template>
    <div>
        <div v-if="! editing">
            <h1 v-text="page.title"></h1>
            <p v-text="page.body"></p>
            <button id="edit" @click="edit">Edit</button>
        </div>
        <page-form 
            v-if="editing" 
            :data-page="dataPage" 
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
    props: ['dataPage'],
    data() {
        return {
            page: this.dataPage,
            editing: false
        }
    },
    methods: {
        edit: function() {
            this.toggle();
        },
        refresh: function(data) {
            this.page = JSON.parse(JSON.stringify(data))
            this.toggle();
        },
        toggle: function() {
            this.editing = ! this.editing;
        }
    }
}
</script>