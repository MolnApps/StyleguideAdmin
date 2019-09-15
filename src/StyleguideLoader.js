import axios from 'axios'
import EventEmitter from 'events'
import bus from './bus'

class StyleguideLoader extends EventEmitter
{
	constructor(store, url)
	{
		super();

		this.store = store;
		this.url = url;
	}

	load()
	{
		axios.get(this.url.append('/all'))
			.then((response) => {
				// Initialize store
				this.store.dispatch('pages/initialize', response.data['pages']);
				// Initialize pageables
				this.store.dispatch('logos/initialize', response.data['logos']);
				this.store.dispatch('colours/initialize', response.data['colour-palette']);
				this.store.dispatch('typefaces/initialize', response.data['typefaces']);
				this.store.dispatch('images/initialize', response.data['images']);
				this.store.dispatch('video/initialize', response.data['videos']);
				this.store.dispatch('people/initialize', response.data['contacts']);
				
				this.store.dispatch('index/initialize', response.data['index']);
				
				bus.$emit('styleguide_loaded');
			})
			.catch((error) => {
				bus.$emit('feedback', [{
					type: 'error', 
					text: 'Could not load styleguide'
				}]);
				console.log(error);
			});
	}
}

export default StyleguideLoader;