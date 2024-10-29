import './app.pcss';
import App from './App.svelte';
import { mount } from "svelte";

document.getElementById('app-title').innerHTML = 'Gestion des traductions';

const app = mount(App, {
  target: document.getElementById('app'),
});

export default app;
