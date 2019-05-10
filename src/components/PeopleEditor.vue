<template>
    <div>
        <div v-if="! displayForm">
            <div v-for="(person, index) in pagePeople" :key="person.id" :data-id="person.id">
                {{person.full_name}} ({{person.job_title}})
                <span class="edit" @click="onEdit(person)">Edit</span>
                <span class="del" @click="onRemove(index)">Remove</span>
            </div>
            <div class="Actions">
                <button id="add" @click="onAdd" class="Button Button--primary">Add</button>
            </div>
            <div class="Actions">
                <button id="cancelChanges" @click="onCancelChanges" class="Button Button--secondary">Cancel changes</button>
                 <button id="saveChanges" @click="onSaveChanges" class="Button Button--primary">Save changes</button>
            </div>
        </div>
        <person-form v-if="displayForm" :data-person="person" @cancel="toggleForm" @success="toggleForm"></person-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm';
import PersonForm from './PersonForm.vue';
export default {
    components: {PersonForm},
    props: [
        'dataPagePeople', 
        'dataEndpoint'
    ],
    data() {
        return {
            pagePeople: this.dataPagePeople,
            displayForm: false,
            person: {}
        }
    },
    methods: {
        onAdd: function() {
            this.toggleForm();
        },
        onRemove: function(index) {
            this.pagePeople.splice(index, 1);
        },
        onEdit: function(person) {
            this.person = person;
            this.toggleForm();
        },
        toggleForm: function() {
            this.displayForm = ! this.displayForm;
        },
        onSaveChanges: function() {
            let form = new StyleguideForm({
                person_id: this.pagePeople.map(p => p.id)
            })

            form.on('success', this.onSuccess.bind(this));

            form.submit(this.dataEndpoint);
        },
        onSuccess: function(data) {
            this.$emit('success');
        },
        onCancelChanges: function() {
            this.$emit('cancel');
        }
    }
}
</script>