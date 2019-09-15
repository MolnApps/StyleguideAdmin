import Url from './Url.js';
class ComponentResolver
{
	constructor(store)
	{
        this.store = store;
        this.page = {id: null};

		this.maps = {
            componentsForPageType: {
                'text-side': {
                    'logo': 'Logo', 
                    'logo-safety': 'Logo safety areas', 
                    'logo-size': 'Logo size', 
                    'colour-palette': 'Colour palette', 
                    'typography': 'Typography', 
                    'moodboard': 'Moodboard', 
                    'video': 'Video',
                },
                'chapter': {
                    'none': 'None',
                    'contacts': 'Contacts'
                }
            },
            idToComponent: {
                'logo': 'LogoEditor',
                'logo-safety': 'LogoEditor',
                'logo-size': 'LogoEditor',
                'colour-palette': 'ColourPaletteEditor',
                'typography': 'TypographyEditor',
                'moodboard': 'MoodboardEditor',
                'video': 'VideoEditor',
                'contacts': 'PeopleEditor'
            },
            idToProps: {
                'logo': {
                    dataPageLogos: [], 
                    dataEndpoint: '/logos',
                    dataPageEndpoint: '/pages/{id}/logos'
                },
                'logo-size': {
                    dataPageLogos: [], 
                    dataEndpoint: '/logos',
                    dataPageEndpoint: '/pages/{id}/logos'
                },
                'logo-safety': {
                    dataPageLogos: [], 
                    dataEndpoint: '/logos',
                    dataPageEndpoint: '/pages/{id}/logos'
                },
                'colour-palette': {
                    dataPageColours: [],
                    dataEndpoint: '/colours',
                    dataPageEndpoint: '/pages/{id}/colours'
                },
                'typography': {
                    dataPageTypefaceFamilies: [],
                    dataEndpoint: '/colours',
                    dataPageEndpoint: '/pages/{id}/typefaces'
                },
                'moodboard': {
                    dataPageImages: [], 
                    dataPageEndpoint: '/pages/{id}/images',
                    dataEndpoint: '/images' 
                },
                'video': {
                    dataPageVideo: [],
                    dataPageEndpoint: '/pages/{id}/videos',
                    dataEndpoint: '/videos'
                },
                'contacts': {
                    dataPagePeople: [],
                    dataPageEndpoint: '/pages/{id}/people',
                    dataEndpoint: '/people'
                }
            },
            idToStore: {
                'colour-palette': {
                    prop: 'dataPageColours', 
                    module: 'colours'
                },
                'contacts': {
                    prop: 'dataPagePeople', 
                    module: 'people'
                },
                'logo': {
                    prop: 'dataPageLogos', 
                    module: 'logos'
                },
                'moodboard': {
                    prop: 'dataPageImages', 
                    module: 'images'
                },
                'typography': {
                    prop: 'dataPageTypefaceFamilies', 
                    module: 'typefaces'
                },
                'video': {
                    prop: 'dataPageVideo', 
                    module: 'video'
                },
            }
        }
	}

    setPage(page)
    {
        this.page = page;
    }

	componentsForType(type)
	{
		return this.hasComponentsForPageType(type)
            ? this.maps.componentsForPageType[type] 
            : [];
	}

	resolve(id)
	{
		return this.hasComponent(id)
			? this.maps.idToComponent[id]
			: null;
	}

	resolveProps(id)
	{
        return this.hasProps(id)
        	? this.normalizeProps(this.maps.idToProps[id])
        	: null;
	}

	hasComponentsForPageType(type) {
		return this.maps.componentsForPageType[type] !== undefined;
	}

	hasComponent(id) {
		return this.maps.idToComponent[id] !== undefined;
	}

	hasProps(id) {
		return this.maps.idToProps[id] !== undefined;
	}

    hasStore(id) {
        return this.maps.idToStore[id] !== undefined;
    }

    normalizeProps(props) {
        props = JSON.parse(JSON.stringify(props));
        
        props = this.normalizeEndpoints(props);
        props = this.normalizeStore(props);

        return props;
    }

    normalizeEndpoints(props) {
        let url = new Url();
        props['dataEndpoint'] = url.append(props['dataEndpoint']);
        props['dataPageEndpoint'] = url.append(
            props['dataPageEndpoint'].replace('{id}', this.page.id)
        );
        return props;
    }

    normalizeStore(props) {
        if ( ! this.hasStore(this.page.component)) {
            return props;
        }

        let propName = this.maps.idToStore[this.page.component].prop;
        let storeModule = this.maps.idToStore[this.page.component].module;
        props[propName] = this.store.getters[storeModule + '/byPageSlug'](this.page.slug);

        return props;
    }
}

export default ComponentResolver;