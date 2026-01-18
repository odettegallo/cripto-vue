import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://cripto-vue.web.app/login',
    // env: {}, // Ahora usamos cypress.env.json para las variables de entorno
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
      
    },
  },
});
