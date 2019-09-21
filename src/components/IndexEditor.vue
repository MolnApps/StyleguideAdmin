<template>
    <div>
        <div v-if="displayIndex" class="Container" id="editor">
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
            v-if="display.pageForm" 
            :data-page="currentIndex.page" 
            :data-endpoint="dataPageEndpoint"
            @cancel="onEditCancel" 
            @success="onEditSuccess"
        ></page-form>
        <page-steps 
            v-if="display.pageSteps" 
            :data-endpoint="dataPageEndpoint"
            @cancel="onAddCancel" 
            @success="onAddSuccess"
        ></page-steps>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import IndexItem from './IndexItem.vue';
import PageForm from './PageForm.vue';
import PageSteps from './PageSteps.vue';
import Btn from './Btn.vue';
import bus from '@/bus.js';
export default {
    components: {Btn, IndexItem, PageForm, PageSteps},
    props: [
        'dataIndex', 
        'dataEndpoint', 
        'dataPageEndpoint', 
        'dataToggleEndpoint'
    ],
    data() {
        return {
            index: this.dataIndex,
            currentIndex: null,
            forms: {
                index: null,
                toggleVisibility: null
            },
            display: {
                pageForm: false,
                pageSteps: false
            }
        }
    },
    computed: {
        displayIndex() {
            return ! this.display.pageForm && ! this.display.pageSteps;
        }
    },
    created() {
        this.forms.index = new StyleguideForm({});
        this.forms.toggleVisibility = new StyleguideForm({});
    },
    methods: {
        onAdd: function(index) {
            this.togglePageStepsForm();
        },
        onEdit: function(index) {
            this.currentIndex = index;
            this.togglePageForm();
        },
        onToggle: function(index) {
            this.forms.toggleVisibility = new StyleguideForm({id: index.page.id});
            this.forms.toggleVisibility.on('success', (response) => {
                this.$emit('toggleSuccess');
                bus.$emit('feedback', response.feedback);
            })
            this.forms.toggleVisibility.submit(this.dataToggleEndpoint);
        },
        onAddCancel: function() {
            this.togglePageStepsForm();
        },
        onEditCancel: function() {
            this.togglePageForm();
        },
        onAddSuccess: function(record) {
            if ( ! record) {
                return this.togglePageStepsForm();
            }

            this.index.push({
                id: null,
                parent_id: null,
                page_id: record.id,
                page: record,
                position: 0,
                children: []
            });

            this.togglePageStepsForm();
        },
        onEditSuccess: function(record) {
            if ( ! record) {
                return this.togglePageForm();
            }
            this.currentIndex.page_id = record.id;
            this.currentIndex.page = record;
            this.togglePageForm()
        },
        onEnd: function() {
            this.onSaveChanges();
        },
        onCancelChanges: function() {
            this.$emit('cancel');
        },
        onSaveChanges: function() {
            this.forms.index = new StyleguideForm({
                index: this.serializeIndex(this.index, [])
            });

            this.forms.index.on('success', (response) => {
                this.$emit('success');
                bus.$emit('feedback', response.feedback)
            });
            this.forms.index.on('fail', (response) => {
                bus.$emit('feedback', response.feedback)
            });

            this.forms.index.submit(this.dataEndpoint);
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
            this.display.pageForm = ! this.display.pageForm;
        },
        togglePageStepsForm: function() {
            this.display.pageSteps = ! this.display.pageSteps;
        }
    }
}
</script>