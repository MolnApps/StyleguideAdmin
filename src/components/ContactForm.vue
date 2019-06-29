<template>
    <div>
        <h3 class="Title Title--small">Contacts</h3>
        <ul class="List">
            <li 
                v-for="(contact, index) in contacts" 
                :key="index" 
                :data-id="index + 1"
                class="List__item"
            >
                <div class="List__left">
                    <div v-if="contact.type == 'email'">
                        <input type="hidden" name="type" value="email" />
                        <input 
                            type="text" 
                            name="value" 
                            v-model="contact.value.value" 
                            placeholder="info@example.com" 
                            class="Form__input Contact__email" 
                        />
                    </div>
                    <div v-if="contact.type == 'telephone'" class="Contact__telephone">
                        <input type="hidden" name="type" value="telephone" />
                        <input 
                            type="text" 
                            name="prefix" 
                            v-model="contact.value.prefix" 
                            placeholder="+1" 
                            class="Form__input Contact__prefix" 
                        />
                        <input 
                            type="text" 
                            name="number" 
                            v-model="contact.value.number" 
                            placeholder="000 00 00 000" 
                            class="Form__input Contact__number" 
                        />
                    </div>
                </div>
                <div class="List__right">
                    <btn class="del" type="secondary" size="xs" @click="onRemove(index)">Remove</btn>
                </div>
            </li>
            <li class="List__actions">
                <btn id="add_email" ref="addEmail" type="secondary" @click="onAddEmail">Add email</btn>
                <btn id="add_telephone" ref="addTelephone" type="secondary" @click="onAddTelephone">Add telephone</btn>
            </li>
        </ul>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import Btn from './Btn.vue';
export default {
    components: {Btn},
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