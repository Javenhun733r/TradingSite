import router from "@/components/router";
import { createApp } from 'vue'
import App from './App.vue'
import {FontAwesomeIcon} from "@/components/plugins/FontAwesome";
const app = createApp(App).component("font-awesome-icon", FontAwesomeIcon);
app.use(router)
app.mount('#app')