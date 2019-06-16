<template>
    <div>
        <div v-if="! displayForm" class="Container">
            <h3 class="Title">People</h3>
            <div class="List">
                <div v-for="(person, index) in pagePeople" :key="person.id" :data-id="person.id" class="List__item">
                    <div class="List__left">
                        {{person.full_name}} ({{person.job_title}})
                    </div>
                    <div class="List__right">
                        <span class="edit Button Button--secondary Button--xs" @click="onEdit(person)">Edit</span>
                        <span class="del Button Button--secondary Button--xs" @click="onRemove(index)">Remove</span>
                    </div>
                </div>
                <div class="List__actions">
                    <button id="add" @click="onAdd" class="Button Button--primary">Add</button>
                </div>
            </div>
            <div class="Actions">
                <button id="cancelChanges" @click="onCancelChanges" class="Button Button--secondary Button--xl">Cancel changes</button>
                 <button id="saveChanges" @click="onSaveChanges" class="Button Button--primary Button--xl">Save changes</button>
            </div>
        </div>
        <person-form 
            v-if="displayForm" 
            :data-endpoint="dataFormEndpoint" 
            :data-person="person" 
            @cancel="onFormClosed" 
            @success="onFormSaved"
        ></person-form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm';
import PersonForm from './PersonForm.vue';
export default {
    components: {PersonForm},
    props: [
        'dataPagePeople', 
        'dataEndpoint',
        'dataFormEndpoint'
    ],
    data() {
        return {
            pagePeople: this.dataPagePeople,
            displayForm: false,
            person: {contacts: []}
        }
    },
    methods: {
        onFormClosed: function()
        {
            this.person = {contacts: []};
            this.toggleForm();
        },
        onFormSaved: function(record) {
            if (this.person.id !== record.id) {
                this.pagePeople.push(record);
            } else {
                this.pagePeople.map((person, i) => {
                    if (person.id === record.id) {
                        this.pagePeople[i] = record;
                    }
                });
            }
            this.person = {contacts: []};
            this.toggleForm();
        },
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