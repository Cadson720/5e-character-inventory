import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Import the router instance
import './assets/styles/main.css'; // Import main styles (e.g., Tailwind CSS)


const app = createApp(App);

app.use(router); // Use the router in the Vue app

app.mount('#app'); // Mount the app to the DOM
