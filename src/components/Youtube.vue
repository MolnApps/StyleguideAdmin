<template>
	<div style="padding:56.25% 0 0 0;position:relative;">
		<iframe 
			width="560" 
			height="315" 
			style="position:absolute;top:0;left:0;width:100%;height:100%;" 
			v-bind:src="getUrl" 
			frameborder="0" 
			allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen
		></iframe>
	</div>
</template>
<script>
export default {
	props: ['id'],
	computed: {
		getUrl() {
			return 'https://www.youtube-nocookie.com/embed/' + this.id;
		}
	}
}
</script>