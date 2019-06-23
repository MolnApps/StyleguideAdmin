import bus from './bus'

export default {
	bus,
	install (Vue, options) {
		Vue.prototype.$bus = bus
	}
}