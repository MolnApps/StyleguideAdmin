<template>
    <div class="Feedback__container" v-if="feedback">
        <p 
            v-for="message in feedback" 
            v-text="message" 
            class="Feedback Feedback--success animated-opacity" 
            :class="displayClass"
        ></p>
    </div>
</template>

<script>
export default {
    props: {
        dataFeedback: {}, 
        dataDuration: {default: 5}
    },
    data() {
        return {
            feedback: this.dataFeedback,
            duration: parseInt(this.dataDuration),
            displayClass: 'hide-opacity'
        }
    },
    created() {
        if ( ! this.duration) {
            return;
        }

        setTimeout(() => {
            this.displayClass = 'show-opacity';
        }, 1);

        setTimeout(() => {
            this.displayClass = 'hide-opacity';
        }, this.duration * 1000);
    }
}
</script>

<style>
.hide-opacity{
    opacity: 0;
}
.show-opacity {
    opacity: 1;
}
.animated-opacity {
    transition: opacity 1s ease-in-out;
}
</style>