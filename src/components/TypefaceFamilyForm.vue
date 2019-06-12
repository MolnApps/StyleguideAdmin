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
    				    <button 
                            @click="removeWeight(index)" 
                            class="del Button Button--secondary"
                        >Remove</button>
                    </div>
    			</div>
                <div class="List__actions">
                    <button @click="addWeight(index)" class="add Button Button--primary">Add weight</button>
                </div>
            </div>
            <div class="Actions">
                <button id="cancel" @click="cancel" class="Button Button--secondary">Cancel</button>
                <button id="save" @click="save" class="Button Button--primary">Save</button>
            </div>
        </form>
    </div>
</template>

<script>
import StyleguideForm from './../StyleguideForm.js'
export default {
	props: ['dataTypefaceFamily', 'dataEndpoint'],
    data() {
    	return {
    		typefaceFamily: this.dataTypefaceFamily,
    		form: null
    	}
    },
    created() {
    	this.resetForm();
    },
    methods: {
    	cancel: function() {
    		this.resetForm();
    		this.$emit('cancel');
    	},
    	save: function() {
            this.form.on('success', this.onSuccess.bind(this));
    		this.form.submit(this.dataEndpoint + '/' + this.dataTypefaceFamily.id);
    	},
    	onSuccess: function(data) {
    		this.resetForm();
    		this.$emit('success', {
                data: data
            });
    	},
    	removeWeight: function(index) {
    		this.form.weights.splice(index, 1);
    	},
    	addWeight: function() {
    		this.form.weights.push({name: '', weigth: ''});
    	},
    	resetForm: function() {
    		this.form = new StyleguideForm(this.dataTypefaceFamily, [
    			'title', 
    			'weights', 
    			'webfont_url', 
    			'foundry_url'
    		]);
    	}
    }
}
</script>