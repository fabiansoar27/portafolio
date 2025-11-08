# Implementation Plan

## Overview
Este plan de implementación convierte el diseño de migración del portafolio en tareas de código incrementales. Cada tarea construye sobre las anteriores, comenzando con la configuración del proyecto y terminando con la integración completa de todas las funcionalidades.

---

## Tasks

- [x] 1. Configurar proyecto React con Vite y dependencias base





  - Crear proyecto con `npm create vite@latest portfolio-react -- --template react`
  - Instalar dependencias: `react-router-dom`, `@supabase/supabase-js`
  - Configurar estructura de carpetas: `src/components/`, `src/pages/`, `src/hooks/`, `src/services/`, `src/assets/`
  - Copiar archivos CSS, imágenes y fuentes del portafolio actual a `src/assets/`
  - Configurar variables de entorno en `.env` para Supabase (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
  - _Requirements: 2.1, 2.2, 12.5_

- [x] 2. Configurar cliente de Supabase y esquema de base de datos





  - [x] 2.1 Crear archivo `src/supabaseClient.js` con configuración del cliente Supabase


    - Importar `createClient` de `@supabase/supabase-js`
    - Inicializar cliente con variables de entorno
    - Exportar instancia del cliente
    - _Requirements: 3.1_

  - [x] 2.2 Crear esquema de base de datos en Supabase


    - Crear tabla `projects` con columnas: id (uuid, primary key), title (text), category (text), image_url (text), link (text), created_at (timestamp)
    - Crear tabla `testimonials` con columnas: id (uuid, primary key), name (text), image_url (text), rating (integer), comment (text), created_at (timestamp)
    - Crear tabla `metrics` con columnas: id (uuid, primary key), metric_type (text), count (integer), last_updated (timestamp)
    - Configurar políticas RLS (Row Level Security) para permitir lectura pública y escritura solo para usuarios autenticados
    - Crear bucket de Storage llamado `portfolio-images` con acceso público para lectura
    - _Requirements: 3.2, 3.3, 3.4, 3.5_

- [x] 3. Implementar sistema de rutas y layout base





  - Crear `src/App.jsx` con React Router configurado
  - Definir rutas: `/` (Home), `/admin` (Admin Panel protegido), `/proyectos` (Projects List)
  - Crear componente `ProtectedRoute` que verifique autenticación antes de mostrar rutas admin
  - Implementar redirección a `/admin/login` si usuario no está autenticado
  - _Requirements: 2.3, 6.1_

- [x] 4. Migrar componentes públicos del portafolio






  - [x] 4.1 Crear componente `Preloader.jsx`

    - Replicar HTML y CSS del preloader actual (círculos expandiéndose)
    - Implementar lógica para ocultar preloader después de cargar la página
    - Usar `useState` y `useEffect` para controlar visibilidad
    - _Requirements: 1.5_

  - [x] 4.2 Crear componente `Navbar.jsx`


    - Migrar estructura HTML del header/nav actual
    - Mantener iconos Boxicons y enlaces de navegación (Home, Sobre mí, Habilidades, Portafolio, Contacto)
    - Implementar lógica de scroll para cambiar estilos del header
    - Agregar funcionalidad de menú móvil (toggle)
    - _Requirements: 1.3, 11.2_

  - [x] 4.3 Crear componente `Hero.jsx`


    - Migrar sección home con foto de perfil, título, descripción y botones
    - Mantener animaciones de texto y efectos visuales
    - Implementar botón de descarga de CV que registre métrica
    - Agregar enlaces a redes sociales
    - _Requirements: 1.1, 1.2, 1.4, 7.2_

  - [x] 4.4 Crear componente `About.jsx`


    - Migrar sección "Sobre mí" con imagen y descripción
    - Mantener layout de dos columnas responsive
    - Incluir botón de descarga de CV
    - _Requirements: 1.4, 11.1_

  - [x] 4.5 Crear componente `Skills.jsx`


    - Migrar sección de habilidades con iconos y nombres
    - Mantener grid responsive de habilidades
    - Preservar estilos y espaciados originales
    - _Requirements: 1.4, 11.1_

  - [x] 4.6 Crear componente `Projects.jsx` para home


    - Crear componente que muestre proyectos destacados (primeros 6)
    - Implementar hook `useProjects()` para obtener datos de Supabase
    - Renderizar proyectos en grid con imagen, título y categoría
    - Agregar filtros por categoría (Todo/Diseño/Web/App) con animación
    - Implementar enlace "Ver más proyectos" que redirija a `/proyectos`
    - _Requirements: 1.4, 4.4, 9.1, 9.2_

  - [x] 4.7 Crear componente `Testimonials.jsx`


    - Implementar hook `useTestimonials()` para obtener datos de Supabase
    - Integrar Swiper.js para carrusel de testimonios
    - Renderizar testimonios con foto, nombre, estrellas y comentario
    - Mantener estilos y animaciones del carrusel actual
    - _Requirements: 5.4, 1.4_

  - [x] 4.8 Crear componente `Contact.jsx`


    - Migrar formulario de contacto con campos: nombre, contacto, servicio, mensaje
    - Implementar validación de campos requeridos
    - Integrar EmailJS para envío de emails (usar misma configuración actual)
    - Mostrar notificaciones toast de éxito/error usando librería de notificaciones
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [x] 4.9 Crear componente `Footer.jsx`


    - Migrar footer con enlaces a redes sociales y copyright
    - Mantener estilos y estructura original
    - _Requirements: 1.4_

- [x] 5. Crear página Home completa





  - Crear `src/pages/Home.jsx` que integre todos los componentes públicos
  - Importar y renderizar: Preloader, Navbar, Hero, About, Skills, Projects, Testimonials, Contact, Footer
  - Implementar lógica de registro de visitas al cargar la página
  - Usar hook `useEffect` para incrementar contador de visitas en Supabase
  - Prevenir conteos duplicados usando sessionStorage
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 7.1, 7.5_

- [x] 6. Implementar página de proyectos completa



  - Crear `src/pages/ProjectsList.jsx`
  - Reutilizar hook `useProjects()` para obtener todos los proyectos
  - Renderizar todos los proyectos en grid responsive
  - Implementar filtros por categoría con animación (reutilizar lógica de Projects.jsx)
  - Incluir Navbar y Footer para mantener consistencia
  - Agregar enlaces externos que abran en nueva pestaña
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_

- [x] 7. Implementar sistema de autenticación


  - [x] 7.1 Crear página `src/pages/Login.jsx`

    - Crear formulario con campos email y contraseña
    - Implementar función de login usando `supabase.auth.signInWithPassword()`
    - Mostrar mensajes de error si credenciales son inválidas
    - Redirigir a `/admin` después de login exitoso
    - _Requirements: 6.2, 6.3_

  - [x] 7.2 Crear hook `useAuth()` para gestionar estado de autenticación

    - Implementar funciones: `login()`, `logout()`, `getUser()`
    - Usar `supabase.auth.onAuthStateChange()` para detectar cambios de sesión
    - Mantener estado del usuario autenticado en contexto o estado global
    - _Requirements: 6.4_

  - [x] 7.3 Implementar componente `ProtectedRoute`

    - Verificar si usuario está autenticado usando hook `useAuth()`
    - Redirigir a `/admin/login` si no hay sesión activa
    - Renderizar componente hijo si usuario está autenticado
    - _Requirements: 6.1_

  - [x] 7.4 Agregar funcionalidad de logout

    - Crear botón de logout en Admin Panel
    - Implementar función que llame `supabase.auth.signOut()`
    - Redirigir a login después de cerrar sesión
    - _Requirements: 6.5_

- [x] 8. Crear panel de administración - Dashboard



  - Crear `src/pages/Admin.jsx` como layout principal del admin
  - Implementar navegación lateral o superior con enlaces: Dashboard, Proyectos, Testimonios
  - Crear componente `Dashboard.jsx` que muestre métricas
  - Implementar hook `useMetrics()` para obtener datos de tabla `metrics`
  - Mostrar tarjetas con: Total de visitas, Total de descargas de CV
  - Agregar gráficos o visualizaciones simples (opcional: usar Chart.js o Recharts)
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 9. Crear panel de administración - Gestión de Proyectos



  - [x] 9.1 Crear página `src/pages/admin/ProjectsAdmin.jsx`

    - Mostrar lista de todos los proyectos en tabla o cards
    - Agregar botones "Editar" y "Eliminar" para cada proyecto
    - Incluir botón "Nuevo Proyecto" que abra modal o formulario
    - _Requirements: 4.1_

  - [x] 9.2 Crear componente `ProjectForm.jsx` para crear/editar proyectos

    - Crear formulario con campos: título, categoría (select), imagen (file upload), enlace
    - Implementar función para subir imagen a Supabase Storage
    - Guardar URL de imagen en base de datos junto con otros datos
    - Validar campos requeridos antes de enviar
    - _Requirements: 4.2, 4.3_

  - [x] 9.3 Implementar funciones CRUD para proyectos

    - Crear servicio `src/services/projectsService.js` con funciones: `createProject()`, `updateProject()`, `deleteProject()`, `getProjects()`
    - Usar cliente de Supabase para operaciones de base de datos
    - Implementar eliminación de imagen de Storage al eliminar proyecto
    - _Requirements: 4.4, 4.5_

- [x] 10. Crear panel de administración - Gestión de Testimonios



  - [x] 10.1 Crear página `src/pages/admin/TestimonialsAdmin.jsx`

    - Mostrar lista de todos los testimonios
    - Agregar botones "Editar" y "Eliminar" para cada testimonio
    - Incluir botón "Nuevo Testimonio"
    - _Requirements: 5.1_

  - [x] 10.2 Crear componente `TestimonialForm.jsx`

    - Crear formulario con campos: nombre, foto (file upload), calificación (1-5 estrellas), comentario
    - Implementar subida de foto a Supabase Storage con optimización
    - Validar campos requeridos
    - _Requirements: 5.2, 5.3_

  - [x] 10.3 Implementar funciones CRUD para testimonios

    - Crear servicio `src/services/testimonialsService.js` con funciones CRUD
    - Implementar eliminación de imagen al eliminar testimonio
    - _Requirements: 5.5_

- [x] 11. Implementar sistema de métricas



  - Crear servicio `src/services/metricsService.js`
  - Implementar función `trackVisit()` que incremente contador de visitas
  - Implementar función `trackDownload()` que incremente contador de descargas
  - Agregar lógica de prevención de duplicados usando sessionStorage o cookies
  - Integrar llamadas a estas funciones en componentes Hero y About (botón CV)
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 12. Aplicar estilos y responsive design

  - Migrar archivo `styles.css` completo a `src/assets/styles.css`
  - Importar CSS en `main.jsx` o `App.jsx`
  - Verificar que todos los componentes usen las clases CSS correctas
  - Probar responsive en breakpoints: 320px, 576px, 767px, 992px
  - Ajustar cualquier inconsistencia visual comparando con portafolio original
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 11.1, 11.2, 11.3_

- [x] 13. Integrar librerías externas


  - Instalar e integrar Boxicons para iconos
  - Instalar e integrar Swiper.js para carrusel de testimonios
  - Instalar e integrar EmailJS para formulario de contacto
  - Instalar librería de notificaciones toast (react-hot-toast o react-toastify)
  - Configurar EmailJS con las mismas credenciales del proyecto actual
  - _Requirements: 1.3, 5.4, 10.3, 10.4_

- [ ] 14. Optimización y preparación para producción
  - Configurar variables de entorno para producción
  - Optimizar imágenes y assets
  - Implementar lazy loading para componentes pesados
  - Verificar que todas las rutas funcionen correctamente
  - Probar flujo completo: visita pública → login admin → CRUD proyectos/testimonios → logout
  - _Requirements: 12.5_

- [ ] 15. Testing y validación
  - [ ] 15.1 Escribir tests para componentes críticos
    - Tests para hooks personalizados (useAuth, useProjects, useTestimonials)
    - Tests para servicios de Supabase
    - _Requirements: 2.4_

  - [ ] 15.2 Validar accesibilidad
    - Verificar navegación por teclado en todos los componentes
    - Agregar atributos ARIA donde sea necesario
    - Probar con lector de pantalla
    - _Requirements: 11.4, 11.5_

---

## Notes
- Cada tarea debe completarse antes de pasar a la siguiente para asegurar integración incremental
- Se recomienda hacer commits frecuentes después de completar cada tarea principal
- El diseño visual debe compararse constantemente con el portafolio original durante la implementación
