<template>
    <div>
    	<div class="page Logo__container">
        	<logo v-for="logo in pageLogos" :logo="logo"></logo>
        </div>
        <div class="all Logo__container">
        	<logo v-for="logo in allLogos" :logo="logo"></logo>
        </div>
    </div>
</template>

<script>
import Logo from './Logo.vue';
export default {
    components: {Logo},
    props: ['dataPageLogos', 'dataAllLogos'],
    data() {
    	return {
    		pageLogos: this.dataPageLogos,
    		allLogos: this.dataAllLogos
    	}
    }
}
</script>
<style lang="scss">
.Logo__container {
    justify-content: center;
	display: flex;
    border: 1px solid #ccc;
    padding: 24px;
    margin-bottom: 24px;
}
</style>