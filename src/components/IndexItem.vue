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
            v-for="(i, k) in index" 
            :key="i.id" 
            :class="'index_' + i.id"
            class="pl-4"
        >
            <div 
                class="List__item Page pl-4" 
                :class="'Page--' + i.page.type"
            >
                <div class="List__left">
                    <span class="flex-1">{{ number }}{{k + 1 }} {{ i.page.title }}</span>
                    <span>{{ i.page.type }}</span>
                    <span>{{ i.page.component || 'none' }}</span>
                </div>
                <div class="List__right">
                    <span 
                        class="edit Button Button--secondary Button--xs" 
                        @click="onEdit(i)"
                    >Edit</span>
                    <span 
                        class="del Button Button--secondary Button--xs"
                        @click="onRemove(k)"
                    >Remove</span>
                </div>
            </div>
            <index-item 
                :index="i.children" 
                :owner="i" 
                :number="k + 1 + '.'"
                @end="onEnd" 
                @edit="onEdit" 
            ></index-item>
        </li>
    </draggable>
</template>

<script>
import Draggable from 'vuedraggable'
export default {
    name: 'IndexItem',
    components: {Draggable},
    props: {
        index: {type: Array}, 
        owner: {type: Object},
        number: {type: String, default: ''}
    },
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
        },
        onEdit: function(index) {
            this.$emit('edit', index);
        },
        onRemove: function(index) {
            this.index.splice(index, 1);
        }
    }
}
</script>