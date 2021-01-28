import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import GoogleMap from 'googlemaps-vue3'

createApp(App)
    .use(GoogleMap, { apiKey: 'AIzaSyDfgblqCWc6BlatdtZOe7wLLFZT_2N9IE8' })
    .use(store).mount('#app')
