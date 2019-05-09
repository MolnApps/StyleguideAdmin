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
                headers: { "My-Awesome-Header": "header value" }
            }, this.dataOptions)
        }
    },
    methods: {
        onSuccess: function(file, response) {
            let src = JSON.parse(file.xhr.response).files.file;
            let image = {
                id: 4, 
                src: src, 
                width: 200, 
                height: 200
            };
            this.$emit('success', image);
            this.$refs.dropzone.removeFile(file);
        }
    }
}
</script>