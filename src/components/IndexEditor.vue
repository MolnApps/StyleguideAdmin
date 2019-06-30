<template>
    <div>
        <div v-if="! displayPageForm" class="Container" id="editor">
            <h3 class="Title">Index</h3>
            <div class="List">
                <index-item 
                    :index="index" 
                    :owner="{id: null}" 
                    @end="onEnd" 
                    @edit="onEdit" 
                    @toggle="onToggle"
                ></index-item>
                <div class="List__actions">
                    <btn ref="add" size="m" @click="onAdd">Add</btn>
                </div>
            </div>
            <div class="Actions">
                <btn ref="cancelChanges" type="secondary" @click="onCancelChanges">Cancel changes</btn>
                <btn ref="saveChanges" @click="onSaveChanges" asynch>Save changes</btn>
            </div>
        </div>
        <page-form 
            v-if="displayPageForm" 
            :data-page="currentIndex.page" 
            :data-endpoint="dataPageEndpoint"
            @cancel="onCancel" 
            @success="onSuccess"
        ></page-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import IndexItem from './IndexItem.vue';
import PageForm from './PageForm.vue';
import Btn from './Btn.vue';
export default {
    components: {Btn, IndexItem, PageForm},
    props: ['dataIndex', 'dataEndpoint', 'dataPageEndpoint', 'dataToggleEndpoint'],
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
            this.toggleForm.on('success', (response) => {
                this.$emit('toggleSuccess');
                this.$emit('feedback', response.feedback);
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

            this.indexForm.on('success', (response) => {
                this.$emit('success');
                this.$emit('feedback', response.feedback)
            });
            this.indexForm.on('fail', (response) => {
                this.$emit('feedback', response.feedback)
            });

            this.indexForm.submit(this.dataEndpoint);
        },
        serializeIndex: function(index, data) {
            index.forEach((i) => {
                let parentId = i.parent ? i.parent.id : null;
                data.push({id: i.id, page_id: i.page.id, parent_id: parentId, position: i.position});

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