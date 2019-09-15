import UserInterfaceModule from '@/store/UserInterface.js';
import PageablesModule from '@/store/Pageables.js';

export default {
	modules: {
		ui: UserInterfaceModule,
		// Pages
		pages: PageablesModule,
		// Pageables
		colours: PageablesModule,
		images: PageablesModule,
		logos: PageablesModule,
		people: PageablesModule,
		typefaces: PageablesModule,
		video: PageablesModule,
	}
}