<template>
    <draggable 
        :list="index" 
        :group="{ name: 'g1' }"
        :class="'container_' + owner.id"
        tag="ul" 
        @change="onChange"
        @end="onEnd"
    >
        <li v-for="i in index" :key="i.id" :class="'index_' + i.id">
            {{ i.page.title }}
            <index-item :index="i.children" :owner="i" @end="onEnd"></index-item>
        </li>
    </draggable>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
    name: 'IndexItem',
    components: {Draggable},
    props: ['index', 'owner'],
    methods: {
        onChange: function(data) {
            if (data.added) {
                data.added.element.parent_id = this.owner.id ? this.owner.id : null;
                this.index.splice(data.added.newIndex, 0, data.added.element);
            }
            if (data.removed) {
                this.index.splice(data.removed.oldIndex, 1);
            }
            if (data.moved) {
                this.index.splice(data.moved.oldIndex, 1);
                this.index.splice(data.moved.newIndex, 0, data.moved.element);
            }
            
            this.index.map((i, pos) => {
                i.position = pos;
            });
        },
        onEnd: function() {
            this.$emit('end');
        }
    }
}
</script>