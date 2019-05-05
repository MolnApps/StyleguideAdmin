<template>
    <div>
        <form id="typefaceFamilyForm" class="Form" @submit.prevent="">
            <h2 class="Form__title">Typeface Family</h2>
        	<input type="text" name="title" v-model="form.title" placeholder="Helvetica" class="Form__input" />
        	<p v-if="form.errors.title" v-for="error in form.errors.title" v-text="error"></p>
        	<input type="text" name="webfont_url" v-model="form.webfont_url" placeholder="http://webfonts.example.com/Helvetica" class="Form__input" />
        	<p v-if="form.errors.webfont_url" v-for="error in form.errors.webfont_url" v-text="error"></p>
        	<input type="text" name="foundry_url" v-model="form.foundry_url" placeholder="http://www.example.com/Helvetica" class="Form__input" />
        	<p v-if="form.errors.foundry_url" v-for="error in form.errors.foundry_url" v-text="error"></p>
            <h3 class="Form__title Form__title--small">Weights</h3>
        	<div v-for="(weight, index) in form.weights" class="Form__group">
				<input  type="text" :name="'weights[' + index + '][name]'" v-model="weight.name" class="Form__input" placeholder="e.g. Helvetica Bold"> 
				<input type="text" :name="'weights[' + index + '][weight]'" v-model="weight.weight" class="Form__input" placeholder="e.g. 700"> 
				<button @click="removeWeight(index)" class="del Button Button--secondary">Remove</button>
			</div>
            <button @click="addWeight(index)" class="add Button Button--primary">Add weight</button>
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
    		this.form.submit(this.dataEndpoint);
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