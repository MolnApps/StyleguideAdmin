import UserInterfaceModule from '@/store/UserInterface.js';
import IndexModule from '@/store/Index.js';
import PageablesModule from '@/store/Pageables.js';

export default {
	modules: {
		ui: UserInterfaceModule,
		// Index
		index: IndexModule,
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