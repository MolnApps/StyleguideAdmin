<template>
    <dropzone 
        ref="dropzone" 
        id="dropzone" 
        :options="dropzoneOptions"
        @vdropzone-success="onSuccess"
        @vdropzone-queue-complete="onQueueComplete"
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
            }, this.dataOptions),
            images: []
        }
    },
    methods: {
        onSuccess: function(file, response) {
            this.images.push(response.record);
            //this.$refs.dropzone.removeFile(file);
        },
        onQueueComplete: function() {
            this.images.forEach((image) => {
                this.$emit('success', image);
            });
            this.$emit('feedback', [{
                type: 'success', 
                text: 'The images were uploaded successfully'
            }]);
        },
        getHeaders: function() {
            let endpoint = new Endpoint();
            endpoint.addHeader('authorization');
            return endpoint.getHeaders();
        }
    }
}
</script>