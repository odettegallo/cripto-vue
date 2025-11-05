# 🧩 Proyecto Final Bootcamp — Aplicación Vue 3 + Firebase

Este proyecto es el resultado del trabajo final del Bootcamp, desarrollado con un enfoque modular, escalable y centrado en la experiencia de usuario. Utiliza el ecosistema moderno de Vue 3, Vuetify y Firebase para construir una SPA robusta, con gestión de estado persistente, rutas protegidas y pruebas automatizadas.

## 🚧 Estado del Proyecto

Se están agregando nuevas funcionalidades que aún se encuentran en construcción.  
Este proyecto está en desarrollo activo, por lo que algunas secciones pueden estar incompletas o sujetas a cambios.


## 🚀 Tecnologías y dependencias principales

| Herramienta | Descripción |
|------------|-------------|
| **Vue 3** | Framework progresivo para interfaces reactivas |
| **Vuetify 3** | Framework UI basado en Material Design |
| **Pinia + pinia-plugin-persistedstate** | Gestión de estado centralizada con persistencia |
| **Vue Router 4** | Enrutamiento dinámico y anidado |
| **Firebase 12** | Backend como servicio (auth, firestore, hosting) |
| **Vite 7** | Empaquetador ultrarrápido para desarrollo moderno |
| **Vitest + jsdom + @vue/test-utils** | Testing unitario y de componentes |
| **@mdi/font** | Íconos Material Design para UI enriquecida |
| **vite-plugin-vue-devtools** | Herramientas de depuración para Vue en Vite |

## 📦 Instalación

```bash
git clone https://github.com/odettegallo/cripto-vue.git
cd tu-repo
npm install
```

## 🧪 Scripts disponibles

```bash
npm run dev         # Inicia el servidor de desarrollo
npm run build       # Compila para producción
npm run test        # Ejecuta pruebas con Vitest
```

## 🔐 Funcionalidades destacadas

- Autenticación con Firebase (registro, login, logout)
- Rutas protegidas según estado de sesión
- Persistencia de estado con Pinia
- Componentes reutilizables con Vuetify
- Pruebas unitarias de componentes clave
- Arquitectura modular y escalable

## 🗂️ Estructura del proyecto

```
src/
├── assets/           # Recursos estáticos
├── components/       # Componentes reutilizables
├──//pendiente// composables/      # Lógica reutilizable (composables)
├── router/           # Configuración de rutas
├── store/            # Pinia stores
├── views/            # Vistas principales
├── firebase/         # Configuración y servicios Firebase
└── App.vue / main.js # Entrada principal
```

## 🌐 Despliegue

Este proyecto puede desplegarse fácilmente en Firebase Hosting:

```bash
npm run build
firebase deploy
```

## 🚀 Deploy en Firebase

Puedes acceder a la versión desplegada de la aplicación aquí:  
👉 [Ir al sitio](https://cripto-vue.web.app/login)

## 📚 Créditos

Desarrollado por **Reina** como proyecto final del Bootcamp.  
Contribuciones, sugerencias y feedback son bienvenidos.
