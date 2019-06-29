<template>
    <div class="Container">
        <form id="typefaceFamilyForm" class="Form" @submit.prevent="">
            <h2 class="Title">Typeface Family</h2>
            <div class="Form__row">
                <label class="Form__label">Family name</label>
                <input 
                    type="text" 
                    name="title" 
                    v-model="form.title" 
                    placeholder="Helvetica" 
                    class="Form__input" 
                />
                <p v-for="error in form.errors.title" v-text="error"></p>
            </div>
            <div class="Form__row">
                <label class="Form__label">Webfont URL</label>
                <input 
                    type="text" 
                    name="webfont_url" 
                    v-model="form.webfont_url" 
                    placeholder="http://webfonts.example.com/Helvetica" 
                    class="Form__input" 
                />
                <p v-for="error in form.errors.webfont_url" v-text="error"></p>
            </div>
            <div class="Form__row Form__row--noMargin">
                <label class="Form__label">Foundry URL</label>
                <input 
                    type="text" 
                    name="foundry_url" 
                    v-model="form.foundry_url" 
                    placeholder="http://www.example.com/Helvetica" 
                    class="Form__input" 
                />
                <p v-for="error in form.errors.foundry_url" v-text="error"></p>
            </div>
            <h3 class="Title Title--small Title--mt">Weights</h3>
            <div class="List">
            	<div v-for="(weight, index) in form.weights" class="List__item">
                    <div class="List__left Form__group">
                        <div class="Form__row Form__row--noMargin">
    				        <input  type="text" :name="'weights[' + index + '][name]'" v-model="weight.name" class="Form__input" placeholder="e.g. Helvetica Bold"> 
                        </div>
                        <div class="Form__row Form__row--noMargin">
    				        <input type="text" :name="'weights[' + index + '][weight]'" v-model="weight.weight" class="Form__input" placeholder="e.g. 700"> 
                        </div>
                    </div>
                    <div class="List__right">
                        <btn class="del" @click="removeWeight(index)" type="secondary">Remove</btn>
                    </div>
    			</div>
                <div class="List__actions">
                    <btn ref="add" @click="addWeight(index)">Add weight</btn>
                </div>
            </div>
            <div class="Actions">
                <btn id="cancel" ref="cancel" @click="onCancel" type="secondary">Cancel</btn>
                <btn id="save" ref="save" @click="onSave" asynch>Save</btn>
            </div>
            <p v-for="message in form.feedback" v-text="message"></p>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
import Btn from './Btn.vue'
export default {
    components: {Btn},
	props: ['dataTypefaceFamily', 'dataEndpoint'],
    data() {
    	return {
    		form: new StyleguideForm(this.dataTypefaceFamily, [
                'title', 
                'weights', 
                'webfont_url', 
                'foundry_url'
            ])
    	}
    },
    created() {
    	this.form.shouldReset(true);
        this.form.on('success', this.onSuccess.bind(this));
    },
    methods: {
    	onCancel: function() {
    		this.form.reset();
    		this.$emit('cancel');
    	},
    	onSave: function() {
            this.form.submit(this.dataEndpoint);
    	},
    	onSuccess: function(data) {
            this.$emit('success', {data: data});
    	},
    	removeWeight: function(index) {
    		this.form.weights.splice(index, 1);
    	},
    	addWeight: function() {
    		this.form.weights.push({name: '', weigth: ''});
    	}
    }
}
</script>