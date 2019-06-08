<template>
    <dropzone 
        ref="dropzone" 
        id="dropzone" 
        :options="dropzoneOptions"
        @vdropzone-success="onSuccess"
    ></dropzone>
</template>

<script>
let apiToken = (document.head.querySelector('[name="api-token"]')) 
    ? document.head.querySelector('[name="api-token"]').content
    : '';

import Dropzone from 'vue2-dropzone';
export default {
    components: {Dropzone},
    props: ['dataEndpoint', 'dataOptions'],
    data() {
        return {
            dropzoneOptions: Object.assign({
                url: this.dataEndpoint,
                thumbnailWidth: 150,
                maxFilesize: 0.5,
                acceptedFiles: 'image/*',
                headers: {'Authorization': 'Bearer ' + apiToken}
            }, this.dataOptions)
        }
    },
    methods: {
        onSuccess: function(file, response) {
            this.$emit('success', response.record);
            this.$refs.dropzone.removeFile(file);
        }
    }
}
</script>