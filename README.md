# 🧩 Crypto Portal — Aplicación Vue 3 + Firebase

**Crypto Portal** es una SPA (Single Page Application) desarrollada como proyecto final del Bootcamp, centrada en la educación, seguridad y experiencia de usuario en el ecosistema de criptomonedas. Construida con Vue 3, Vuetify y Firebase, esta aplicación modular permite explorar activos digitales, gestionar sesiones seguras y acceder a contenido educativo.

## 🔐 Funcionalidades principales

- **Autenticación con Firebase**: registro, inicio y cierre de sesión con rutas protegidas.
- **Panel de usuario personalizado**: acceso tras login con visualización de correo y navegación segura.
- **Visualización de criptomonedas en tiempo real**: precios actualizados y opción de agregar al carrito.
- **Gestión de estado persistente con Pinia**: mantiene la sesión activa y sincroniza datos clave.
- **Componentes reutilizables con Vuetify**: diseño responsivo y coherente basado en Material Design.
- **Documentación educativa integrada**: explicaciones sobre blockchain, seguridad y estrategias de inversión.
- // pendiente **Pruebas unitarias con Vitest**: cobertura de componentes críticos para asegurar calidad.
- **Despliegue en Firebase Hosting**: acceso público a la versión en producción.


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
