<template>
	<div class="LogoSafety" >
		<div class="LogoSafety__outer">
			<table>
				<tr>
					<td :style="getMarginXY"></td>
					<td :style="getMarginXY">{{ getMarginYLabel }}</td>
					<td :style="getMarginXY"></td>
				</tr>
				<tr>
					<td :style="getMarginY">{{ getMarginXLabel }}</td>
					<td :style="getImageSize">
						<div class="LogoSafety__inner">
							<div 
								class="LogoSafety__measure" 
								:style="getMeasurePositioning"
							>height = x</div>
							<img 
								:src="logo.url" 
								:style="getImageSize" 
								class="LogoSafety__image" 
							/>
						</div>
					</td>
					<td :style="getMarginY">{{ getMarginXLabel }}</td>
				</tr>
				<tr>
					<td :style="getMarginXY"></td>
					<td :style="getMarginXY">{{ getMarginYLabel }}</td>
					<td :style="getMarginXY"></td>
				</tr>
			</table>
		</div>
	</div>
</template>
<script>
export default {
	props: ['logo', 'logoSpecs'], 
	computed: {
		getMarginXLabel() {
			var value = parseInt(this.logoSpecs.space_x) / 100;
			return value + ' x';
		},
		getMarginYLabel() {
			var value = parseInt(this.logoSpecs.space_y) / 100;
			return value + ' x';
		},
		getMeasurePositioning() {
			let minWidth = 100;
			let width = (minWidth + this.convertMarginToPixels(this.logoSpecs.space_x));

			return [
				'left: -' + width + 'px',
				'width: ' + width + 'px'
			].join(';');
		},
		getImageSize() {
			return [
				'width: ' + this.logoSpecs.display_width, 
				'height: ' + this.logoSpecs.display_height
			].join(';');
		},
		getMarginXY() {
			var marginX = this.convertMarginToPixels(this.logoSpecs.space_x);
			var marginY = this.convertMarginToPixels(this.logoSpecs.space_y);
			
			return [
				'width: ' + marginX + 'px', 
				'height: ' + marginY + 'px'
			].join(';');
		},
		getMarginY() {
			var marginY = this.convertMarginToPixels(this.logoSpecs.space_y);
			return 'height: ' + marginY + 'px';
		}
	},
	methods: {
		convertMarginToPixels(space) {
			return parseInt(this.logoSpecs.display_height) / 100 * parseInt(space)
		}
	}
}
</script>
<style>
.LogoSafety {
	display: flex;
	justify-content: center;
	align-items: center;
}
.LogoSafety table {
	text-align: center;
	font-size: 12px;
}
.LogoSafety__outer {
	background: rgba(0, 255, 255, .5);
	border: 1px solid cyan;
}
.LogoSafety__inner {
	position: relative;
}
.LogoSafety__measure {
	position: absolute;
	top: 0;
	bottom: 0;
	
	padding-left: 25px;

	border: 1px dotted black;
	border-left: 1px solid black;
	border-right: 0px;
	
	display: flex;
	justify-content: center;
	align-items: flex-start;
	flex-flow: column;
}
.LogoSafety__image {
	margin: 0;
	padding: 0;
	display: block;
	background: #fff;
}
</style>