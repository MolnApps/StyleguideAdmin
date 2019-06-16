<template>
	<div class="LogoSize" v-bind:style="getBackgroundColour" >
		<div class="LogoSize__container">
			<div class="LogoSize__image">
				<img 
					:src="logo.url" 
					:style="getNormalSize" 
					class="LogoSize__normal" 
				/>
			</div>
			<div class="LogoSize__space"></div>
			<div class="LogoSize__image">
				<img 
					:src="logo.url" 
					:style="getSmallSize" 
					class="LogoSize__small" 
				/>
				<span class="LogoSize__desc">{{ logoSpecs.min_width_text }}</span>
			</div>
		</div>
	</div>
</template>
<script>
export default {
	props: ['logo', 'logoSpecs'], 
	computed: {
		getBackgroundColour() {
			return 'background-color: ' + this.background + ';';
		},
		getNormalSize() {
			return 'width: ' + this.logoSpecs.display_width + ';';
		},
		getSmallSize() {
			return 'width: ' + this.logoSpecs.min_width + ';';
		}
	}
}
</script>
<style>
.LogoSize {
	display: flex;
	justify-content: center;
	align-items: center;
}
.LogoSize__container {
	display: flex;
	justify-content: center;
	align-items: flex-start;
}
.LogoSize__image {
	display: flex;
	flex-flow: column;
	text-align: center;
}
.LogoSize__space {
	width: 100px;
}
.LogoSize__normal {
	
}
.LogoSize__small {
	margin: 0 auto;
}
.LogoSize__desc {
	margin-top: 25px;
	padding: 0px 10px;
	border-left: 1px solid #000;
	border-right: 1px solid #000;
}
</style>