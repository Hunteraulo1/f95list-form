import "./app.pcss"
import App from "./App.svelte"

document.getElementById("app-title").innerHTML = "Gestion des traductions"

const app = new App({
  target: document.getElementById("app"),
})

export default app
