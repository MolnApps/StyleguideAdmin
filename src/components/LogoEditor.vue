<template>
    <div>
    	<div class="page">
        	<logo v-for="logo in pageLogos" :logo="logo"></logo>
        </div>
    </div>
</template>

<script>
import Logo from './Logo.vue';
export default {
    components: {Logo},
    props: ['dataPageLogos'],
    data() {
    	return {
    		pageLogos: this.dataPageLogos
    	}
    }
}
</script>
<style lang="scss">

</style>