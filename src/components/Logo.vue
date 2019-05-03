<template>
    <div :data-id="logo.id" :data-background="background">
        <div :style="'background-color: ' + background" class="Logo">
            <img :src="logo.url" />
            <span v-text="logo.title"></span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['logo'],
    computed: {
        background() {
            return this.logo.pivot ? this.logo.pivot.preferences['background-color'] : '';
        }
    }
}
</script>
<style lang="scss">
.Logo {
    display: flex;
    flex-flow: column;
    align-items: center;
    width: 100px;
}
.Logo img {
    width: 100px;
    height: 100px;
    display: block;
}
.Logo span {
    text-align: center;
    word-wrap: wrap;
}
</style>