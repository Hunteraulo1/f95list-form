import './app.pcss';
import { mount } from 'svelte';
import App from './App.svelte';

document.getElementById('app-title').innerHTML = 'Gestion des traductions';

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
