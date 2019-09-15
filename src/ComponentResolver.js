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
                    dataPage: null,
                    dataEndpoint: '/logos',
                    dataPageEndpoint: '/pages/{id}/logos'
                },
                'logo-size': {
                    dataPage: null,
                    dataEndpoint: '/logos',
                    dataPageEndpoint: '/pages/{id}/logos'
                },
                'logo-safety': {
                    dataPage: null,
                    dataEndpoint: '/logos',
                    dataPageEndpoint: '/pages/{id}/logos'
                },
                'colour-palette': {
                    dataPage: null,
                    dataEndpoint: '/colours',
                    dataPageEndpoint: '/pages/{id}/colours'
                },
                'typography': {
                    dataPage: null,
                    dataEndpoint: '/colours',
                    dataPageEndpoint: '/pages/{id}/typefaces'
                },
                'moodboard': {
                    dataPage: null,
                    dataPageEndpoint: '/pages/{id}/images',
                    dataEndpoint: '/images' 
                },
                'video': {
                    dataPage: null,
                    dataPageEndpoint: '/pages/{id}/videos',
                    dataEndpoint: '/videos'
                },
                'contacts': {
                    dataPage: null,
                    dataPageEndpoint: '/pages/{id}/people',
                    dataEndpoint: '/people'
                }
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

    normalizeProps(props) {
        props = JSON.parse(JSON.stringify(props));
        
        props = this.normalizeEndpoints(props);
        props = this.normalizePage(props);

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

    normalizePage(props) {
        props['dataPage'] = this.page;
        return props;
    }
}

export default ComponentResolver;