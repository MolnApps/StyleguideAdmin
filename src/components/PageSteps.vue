<template>
    <div class="Container" id="pageSteps">
        <ul class="Steps__container Steps__container--margin">
            <li class="Steps__progress" :class="modifierClass('types')">1. Choose page type</li>
            <li class="Steps__progress" :class="modifierClass('components')">2. Choose page component</li>
            <li class="Steps__progress" :class="modifierClass('form')">3. Page contents</li>
            <li class="Steps__progress Steps__progress--back" id="back" @click="onCancel">&lsaquo; Cancel</li>
        </ul>
        <div id="pageTypes" v-if="display.types">
            <h2 class="Title">Choose a page type</h2>
            <ul class="Steps__container">
                <li class="Steps__type" id="type-chapter" @click="chooseType('chapter')"><span>Chapter</span></li>
                <li class="Steps__type" id="type-text" @click="chooseType('text')"><span>Text</span></li>
                <li class="Steps__type" id="type-text-side" @click="chooseType('text-side')"><span>Side Text</span></li>
                <li class="Steps__type" id="type-text-columns" @click="chooseType('text-columns')"><span>Columns Text</span></li>
            </ul>
        </div>
        <div id="pageComponents" v-if="display.components">
            <h2 class="Title">Choose a component</h2>
            <ul class="Steps__container">
                <li 
                    class="Steps__type" 
                    v-for="(component, key) in componentsForType" 
                    :key="key"
                    :id="'component-' + key"
                    @click="chooseComponent(key)"
                >
                    <span v-text="component"></span>
                </li>
            </ul>
        </div>
        <page-form 
            :data-page="data" 
            :data-endpoint="dataEndpoint"
            v-if="display.form" 
            @success="displayComponent"
            @cancel="onReset"
        ></page-form>
        <styleguide-editor
            v-if="data.component && display.editor"
            :page="page"
            @success="onSuccess"
        ></styleguide-editor>
    </div>
</template>

<script>
import PageForm from './PageForm';
import StyleguideEditor from './StyleguideEditor';
import Btn from './Btn';
import ComponentResolver from './../ComponentResolver.js';

export default {
    components: {
        PageForm, 
        StyleguideEditor,
        Btn
    },
    props: ['dataEndpoint'],
    data() {
        return {
            display: {},
            data: {},
            resolver: new ComponentResolver,
            page: null
        }
    },
    created() {
        this.initialize();
    },
    computed: {
        componentsForType() {
            return this.resolver.componentsForType(this.data.type);
        }
    },
    methods: {
        chooseType: function(type) {
            this.data.type = type;

            this.display.types = false;

            if (Object.entries(this.componentsForType).length > 0) {
                this.display.components = true;
            } else {
                this.display.form = true;
            }
        },
        chooseComponent: function(component) {
            this.data.component = component;
            this.display.components = false;
            this.display.form = true;
        },
        displayComponent: function(record) {
            this.page = record;
            this.resolver.setPage(record);
            if (this.resolver.hasComponent(this.data.component)) {
                this.display.form = false;
                this.display.editor = true;
            } else {
                this.$emit('success', record);
                this.initialize();
            }
        },
        onSuccess: function() {
            this.$emit('success', this.page);
            this.initialize();
        },
        onCancel: function() {
            if (this.data.type == '') {
                this.$emit('cancel');
            }
            this.onReset();
        },
        onReset: function() {
            this.initialize();
        },
        initialize: function() {
            this.display = {
                types: true,
                components: false,
                form: false,
                editor: false
            }
            this.data = {
                type: '',
                component: ''
            };
            this.page = null;
        },
        modifierClass: function(str) {
            let classes = [];
            if (this.display[str]) {
                classes.push('Steps__progress--current');
            }
            if (str == 'types') {
                classes.push('Steps__progress--on');
            }
            if (str == 'components' && this.data.type) {
                classes.push('Steps__progress--on');
            }
            if (str == 'form' && this.data.type && this.data.component) {
                classes.push('Steps__progress--on');
            }
            return classes.join(' ');
        }
    }
}
</script>