<template>
    <div class="Container">
        <h3 class="Title">Index</h3>
        <p v-for="message in form.feedback" v-text="message"></p>
        <index-item :index="index" :owner="{id: 0}" @end="onEnd"></index-item>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js';
import IndexItem from './IndexItem.vue';
export default {
    components: {IndexItem},
    props: ['dataIndex', 'dataEndpoint'],
    data() {
        return {
            index: this.dataIndex,
            form: null
        }
    },
    created() {
        this.form = new StyleguideForm({});
    },
    methods: {
        onEnd: function() {
            this.form = new StyleguideForm({
                index: this.serializeIndex(this.index, [])
            });

            this.form.on('success', () => {
                this.$emit('success');
            });

            this.form.submit(this.dataEndpoint);
        },
        serializeIndex: function(index, data) {
            index.forEach((i) => {
                data.push({id: i.id, parent_id: i.parent_id, position: i.position});

                data = this.serializeIndex(i.children, data);
            });

            return data;
        }
    }
}
</script>