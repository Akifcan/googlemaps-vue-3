import GoogleMap from '@/components/GoogleMap.vue';
export default {
    install: (app, options) => {
        if (!options) {
            console.error('googlemaps-vue-3 |  Please provide google maps api key');
            return
        }
        app.provide('googleMapApiKey', options.apiKey)
        app.component('GoogleMap', GoogleMap)
    }
}