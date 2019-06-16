<template>
    <div class="Container">
        <ul id="pageTypes" v-if="display.types">
            <li><span id="type-chapter" @click="chooseType('chapter')">Chapter</span></li>
            <li><span id="type-text" @click="chooseType('text')">Text</span></li>
            <li><span id="type-text-side" @click="chooseType('text-side')">Side Text</span></li>
            <li><span id="type-text-columns" @click="chooseType('text-columns')">Columns Text</span></li>
        </ul>
        <ul id="pageComponents" v-if="display.components">
            <li v-for="(component, key) in componentsForType" :key="key">
                <span 
                    v-text="component"
                    :id="'component-' + key"
                    @click="chooseComponent(key)"
                ></span>
            </li>
        </ul>
        <page-form 
            :data-page="data" 
            :data-endpoint="dataEndpoint"
            v-if="display.form" 
            @success="displayComponent"
        ></page-form>
        <logo-editor v-if="display.logo"></logo-editor>
    </div>
</template>

<script>
import PageForm from './PageForm';
import LogoEditor from './LogoEditor';
export default {
    components: {PageForm, LogoEditor},
    props: ['dataEndpoint'],
    data() {
        return {
            display: {
                types: true,
                components: false,
                form: false,
                logo: false
            },
            data: {
                type: '',
                component: ''
            },
            components: {
                'text-side': {
                    'none': 'None', 
                    'logo': 'Logo', 
                    'logo-safety': 'Logo safety areas', 
                    'logo-size': 'Logo size', 
                    'colour-palette': 'Colour palette', 
                    'typography': 'Typography', 
                    'moodboard': 'Moodboard', 
                    'video': 'Video',
                },
                'chapter': {
                    'none': 'None',
                    'contacts': 'Contacts'
                }
            }
        }
    },
    computed: {
        componentsForType() {
            return this.components[this.data.type] !== undefined
                ? this.components[this.data.type] 
                : [];
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
        displayComponent: function() {
            if (this.data.component == 'logo') {
                this.display.form = false;
                this.display.logo = true;
            }
        }
    }
}
</script>