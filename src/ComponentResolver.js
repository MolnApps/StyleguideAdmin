class ComponentResolver
{
	constructor()
	{
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
                    dataAllLogos: [], 
                    dataEndpoint: '/pages/{id}/logos'
                },
                'moodboard': {
                    dataUploadEndpoint: '/foo' 
                },
            }
        }
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
        	? this.maps.idToProps[id]
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
}

export default ComponentResolver;