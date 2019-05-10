<template>
    <div>
        <ul>
            <li 
                v-for="(contact, index) in contacts" 
                :key="index" 
                :data-id="index + 1"
            >
                <div v-if="contact.type == 'email'">
                    <input type="hidden" name="type" value="email" />
                    <input type="text" name="value" v-model="contact.value.value" placeholder="info@example.com" class="Form__input" />
                </div>
                <div v-if="contact.type == 'telephone'">
                    <input type="hidden" name="type" value="telephone" />
                    <input type="text" name="prefix" v-model="contact.value.prefix" placeholder="+1" class="Form__input" />
                    <input type="text" name="number" v-model="contact.value.number" placeholder="000 00 00 000" class="Form__input" />
                </div>
                <span class="del" @click="onRemove(index)">Remove</span>
            </li>
        </ul>
        <button id="add_email" @click="onAddEmail" class="Button Button--secondary">Add email</button>
        <button id="add_telephone" @click="onAddTelephone" class="Button Button--secondary">Add telephone</button>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
export default {
    props: ['dataContacts'],
    data() {
        return {
            contacts: this.dataContacts
        }
    },
    methods: {
        onRemove(index) {
            this.contacts.splice(index, 1);
        },
        onAddEmail() {
            this.contacts.push({id: null, type: 'email', value: {value: ''}});
        },
        onAddTelephone() {
            this.contacts.push({id: null, type: 'telephone', value: {prefix: '', number: ''}});
        }
    }
}
</script>