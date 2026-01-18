import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'https://cripto-vue.web.app/login',
    env: {
      valid_username: 'mmura@gmail.com',
      valid_password: 'password1',
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
      return config;
      
    },
  },
});
