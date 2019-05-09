<template>
	<div style="padding:56.25% 0 0 0;position:relative;">
		<iframe 
			v-bind:src="getVimeoUrl" 
			style="position:absolute;top:0;left:0;width:100%;height:100%;" 
			frameborder="0" 
			webkitallowfullscreen 
			mozallowfullscreen 
			allowfullscreen
		></iframe>
	</div>
</template>
<script>
export default {
	props: ['id'],
	computed: {
		getVimeoUrl() {
			return 'https://player.vimeo.com/video/' + this.id + '?title=0&byline=0&portrait=0';
		}
	}
}
</script>