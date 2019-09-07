class ComponentResolver
{
	constructor()
	{
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
                'colour-palette': 'ColourPaletteEditor',
                'typography': 'TypographyEditor',
                'moodboard': 'MoodboardEditor',
                'video': 'VideoEditor'
            },
            idToProps: {
                'logo': {
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
        	? this.overridePageId(this.maps.idToProps[id])
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

    overridePageId(props) {
        props = JSON.parse(JSON.stringify(props));
        let baseUrl = 'http://styleguide-api.test/api/v1/1';
        props['dataEndpoint'] = baseUrl + props['dataEndpoint']
        props['dataPageEndpoint'] = baseUrl + props['dataPageEndpoint'].replace('{id}', this.page.id);
        return props;
    }
}

export default ComponentResolver;