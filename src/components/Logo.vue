<template>
    <div 
        v-text="logo.title" 
        :data-id="logo.id" 
        :data-background="logo.pivot.preferences['background-color']"
    ></div>
</template>

<script>
export default {
    props: ['logo']
}
</script>
<style lang="scss">

</style>