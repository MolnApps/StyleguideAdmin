<template>
    <dropzone 
        ref="dropzone" 
        id="dropzone" 
        :options="dropzoneOptions"
        @vdropzone-success="onSuccess"
    ></dropzone>
</template>

<script>
import Dropzone from 'vue2-dropzone';
import Endpoint from './../Endpoint.js';
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
                headers: this.getHeaders()
            }, this.dataOptions)
        }
    },
    methods: {
        onSuccess: function(file, response) {
            this.$emit('success', response.record);
            this.$refs.dropzone.removeFile(file);
        },
        getHeaders: function() {
            let endpoint = new Endpoint();
            endpoint.addHeader('authorization');
            return endpoint.getHeaders();
        }
    }
}
</script>