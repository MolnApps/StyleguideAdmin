<template>
    <div>
        <div v-if="! displayPageForm" class="Container" id="editor">
            <h3 class="Title">Index</h3>
            <p v-for="message in indexForm.feedback" v-text="message"></p>
            <p v-for="message in toggleForm.feedback" v-text="message"></p>
            <div class="List">
                <index-item 
                    :index="index" 
                    :owner="{id: 0}" 
                    @end="onEnd" 
                    @edit="onEdit" 
                    @toggle="onToggle"
                ></index-item>
                <div class="List__actions">
                    <button 
                        id="add" 
                        @click="onAdd"
                        class="Button Button--primary"
                    >Add</button>
                </div>
            </div>
            <div class="Actions">
                <button 
                    id="cancelChanges" 
                    class="Button Button--secondary Button--xl"
                    @click="onCancelChanges"
                >Cancel changes</button>
                <button 
                    id="saveChanges" 
                    class="Button Button--primary Button--xl"
                    @click="onSaveChanges"
                >Save changes</button>
            </div>
        </div>
        <page-form 
            v-if="displayPageForm" 
            :data-page="currentIndex.page" 
            @cancel="onCancel" 
            @success="onSuccess"
        ></page-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import IndexItem from './IndexItem.vue';
import PageForm from './PageForm.vue';
export default {
    components: {IndexItem, PageForm},
    props: ['dataIndex', 'dataEndpoint', 'dataToggleEndpoint'],
    data() {
        return {
            index: this.dataIndex,
            indexForm: null,
            toggleForm: null,
            displayPageForm: false,
            currentIndex: {page: {}},
            adding: false,
        }
    },
    created() {
        this.indexForm = new StyleguideForm({});
        this.toggleForm = new StyleguideForm({});
    },
    methods: {
        onAdd: function(index) {
            this.adding = true;
            this.currentIndex = {page: {}};
            this.togglePageForm();
        },
        onEdit: function(index) {
            this.currentIndex = index;
            this.togglePageForm();
        },
        onToggle: function(index) {
            this.toggleForm = new StyleguideForm({id: index.page.id});
            this.toggleForm.on('success', () => {
                this.$emit('toggleSuccess');
            })
            this.toggleForm.submit(this.dataToggleEndpoint);
        },
        onCancel: function() {
            this.togglePageForm();
        },
        onSuccess: function(data) {
            if ( ! data) {
                return this.togglePageForm();
            }

            if (this.adding) {
                this.index.push({
                    id: null,
                    parent_id: null,
                    page_id: data.record.id,
                    page: data.record,
                    position: 0
                });

                this.adding = false;
            } else {
                this.currentIndex.page_id = data.record.id;
                this.currentIndex.page = data.record;
            }
            
            this.togglePageForm();
        },
        onCancelChanges: function() {
            this.$emit('cancel');
        },
        onSaveChanges: function() {
            this.onEnd();
        },
        onEnd: function() {
            this.indexForm = new StyleguideForm({
                index: this.serializeIndex(this.index, [])
            });

            this.indexForm.on('success', () => {
                this.$emit('success');
            });

            this.indexForm.submit(this.dataEndpoint);
        },
        serializeIndex: function(index, data) {
            index.forEach((i) => {
                data.push({id: i.id, parent_id: i.parent_id, position: i.position});

                data = this.serializeIndex(i.children, data);
            });

            return data;
        },
        togglePageForm: function() {
            this.displayPageForm = ! this.displayPageForm;
        }
    }
}
</script>