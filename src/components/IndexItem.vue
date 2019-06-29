<template>
    <draggable 
        :list="index" 
        :group="{ name: 'g1' }"
        :class="'container_' + owner.id"
        tag="ul" 
        @change="onChange"
        @end="onEnd"
        class="list-reset"
        :key="forceRender"
    >
        <li 
            v-for="(i, k) in index" 
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
                    <btn 
                        class="visibility" 
                        size="xs" 
                        type="secondary" 
                        @click="onToggle(i)" 
                        v-text="getVisibilityLabel(i)"
                    ></btn>
                    <btn class="edit" size="xs" type="secondary" @click="onEdit(i)" >Edit</btn>
                    <btn class="del" size="xs" type="secondary" @click="onRemove(k)" >Remove</btn>
                </div>
            </div>
            <index-item 
                :index="i.children" 
                :owner="i" 
                :number="k + 1 + '.'"
                @end="onEnd" 
                @edit="onEdit" 
                @toggle="onToggleChild"
            ></index-item>
        </li>
    </draggable>
</template>

<script>
import Draggable from 'vuedraggable'
import Btn from './Btn.vue'
export default {
    name: 'IndexItem',
    components: {Draggable, Btn},
    data() {
        return {
            forceRender: 0
        }
    },
    props: {
        index: {type: Array}, 
        owner: {type: Object},
        number: {type: String, default: ''}
    },
    methods: {
        getVisibilityLabel: function(index) {
            return index.page.visible ? 'Hide' : 'Publish';
        },
        onChange: function(data) {
            if (data.added) {
                data.added.element.parent.id = this.owner.id 
                    ? this.owner.id 
                    : null;
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
        onRemove: function(k) {
            let children = this.index[k].children;
            this.index.splice(k, 1);
            this.moveChildrenToRoot(children);
            this.resetPositionAndParent();
        },
        moveChildrenToRoot: function(children) {
            children.map((child) => {
                this.index.push(child);
            });
        },
        resetPositionAndParent: function() {
            this.index.map((item, p) => {
                item.position = p;
                item.parent = {id: this.owner.id};
            });
        },
        onToggle: function(index) {
            index.page.visible = ! index.page.visible;
            this.forceRender+= 1;
            
            this.$emit('toggle', index);
        },
        onToggleChild: function(index) {
            this.$emit('toggle', index);
        }
    }
}
</script>