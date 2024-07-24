import { createApp } from 'vue';
import { createPinia } from 'pinia';

import './config/sw.config';
import './config/workers.config';

import App from './App.vue';
import router from './router';

import modules from './modules';

import './assets/main.scss';
import { registerModules } from './register-modules';

registerModules(modules);

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount('#app');
