<template>
    <draggable 
        :list="index" 
        :group="{ name: 'g1' }"
        :class="'container_' + owner.id"
        tag="ul" 
        @change="onChange"
        @end="onEnd"
        class="list-reset"
    >
        <li 
            v-for="i in index" 
            :key="i.id" 
            :class="'index_' + i.id"
            class="pl-4"
        >
            <div 
                class="List__item Page pl-4" 
                :class="'Page--' + i.page.type"
            >
                <div class="List__left">{{ i.page.title }}</div>
                <div class="List__right">
                    <span class="edit Button Button--secondary Button--xs">Edit</span>
                    <span class="del Button Button--secondary Button--xs">Remove</span>
                </div>
            </div>
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