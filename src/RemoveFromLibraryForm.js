import StyleguideForm from './StyleguideForm'

class RemoveFromLibraryForm
{
    constructor(storeKey, modalToDisplay, recordToRemove, editorComponent) {
        this.storeKey = storeKey;
        this.recordToRemove = recordToRemove;
        this.editorComponent = editorComponent;

        this.form = this.createForm();

        this.displayConfirmationModal(modalToDisplay);
    }

    submit(endpoint) {
        this.form.submit(endpoint + '/' + this.recordToRemove.id);
    }

    createForm() {
    	let form = new StyleguideForm({ _method: 'delete' });
        
        form.on('success', this.onSuccess.bind(this));
        
        return form;
    }

    onSuccess() {
        this.removeItemFromStore();
        this.emitFeedback();
        this.reset();
    }

    displayConfirmationModal(modalToDisplay) {
    	this.editorComponent.$modal.show(modalToDisplay);
    }

    removeItemFromStore() {
    	this.editorComponent.$store.dispatch(
    		this.storeKey + '/removeById', 
    		this.recordToRemove.id
    	);
    }

    emitFeedback() {
    	this.editorComponent.$emit('feedback', this.form.feedback);
    }

    reset() {
    	this.recordToRemove = null;
    }
}

export default RemoveFromLibraryForm;