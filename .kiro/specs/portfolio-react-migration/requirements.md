# Requirements Document

## Introduction

Este documento define los requisitos para migrar el portafolio actual (HTML, CSS, JS) a una aplicación React moderna con backend Supabase. El objetivo es mantener exactamente el mismo diseño visual y estructura, mientras se moderniza la arquitectura y se agrega un panel de administración completo para gestionar contenido dinámico (proyectos, testimonios) y visualizar métricas (visitas, descargas de CV).

## Glossary

- **Portfolio System**: La aplicación web completa que incluye el sitio público y el panel de administración
- **Public Site**: El sitio web público accesible para todos los visitantes
- **Admin Panel**: Panel de administración protegido accesible en /admin
- **Supabase**: Plataforma backend que proporciona base de datos PostgreSQL, autenticación y almacenamiento
- **Project**: Elemento del portafolio que muestra un trabajo realizado (diseño, web, app)
- **Testimonial**: Comentario de cliente con calificación y foto
- **Metric**: Dato estadístico sobre el uso del sitio (visitas, descargas)
- **Visitor**: Usuario que accede al sitio público
- **Admin User**: Usuario autenticado con acceso al panel de administración

## Requirements

### Requirement 1: Migración Visual Exacta

**User Story:** Como visitante del sitio, quiero ver exactamente el mismo diseño, colores, fuentes y estructura que el portafolio actual, para mantener la identidad visual establecida.

#### Acceptance Criteria

1. WHEN THE Portfolio System renderiza la página principal, THE Portfolio System SHALL utilizar la fuente Poppins con los mismos tamaños y pesos definidos en el CSS original
2. WHEN THE Portfolio System aplica estilos, THE Portfolio System SHALL usar los colores exactos del diseño actual (--first-hue: 353.165, --sat: 95%, --lig: 16%, color principal #51020B)
3. WHEN THE Portfolio System muestra secciones, THE Portfolio System SHALL mantener la misma estructura de navegación con iconos Boxicons (Home, Sobre mí, Habilidades, Portafolio, Contacto)
4. WHEN THE Portfolio System renderiza componentes, THE Portfolio System SHALL preservar todos los espaciados, márgenes, paddings y tamaños del diseño original
5. WHEN THE Portfolio System muestra el preloader, THE Portfolio System SHALL replicar la animación de círculos expandiéndose con el mismo timing y efecto visual

### Requirement 2: Arquitectura React Moderna

**User Story:** Como desarrollador, quiero una aplicación React con Vite y estructura modular, para facilitar el mantenimiento y escalabilidad del código.

#### Acceptance Criteria

1. THE Portfolio System SHALL utilizar React 18+ con Vite como herramienta de build
2. THE Portfolio System SHALL organizar el código en componentes reutilizables (Navbar, Hero, Projects, Testimonials, Footer)
3. THE Portfolio System SHALL implementar React Router v6 para el manejo de rutas (/home, /admin, /proyectos)
4. THE Portfolio System SHALL separar la lógica de negocio de la presentación usando hooks personalizados
5. WHEN THE Portfolio System necesita estilos, THE Portfolio System SHALL utilizar CSS modules o el mismo archivo styles.css adaptado para evitar conflictos de nombres

### Requirement 3: Integración con Supabase

**User Story:** Como administrador, quiero que el sistema se conecte a Supabase para almacenar y gestionar datos dinámicamente, para poder actualizar contenido sin modificar código.

#### Acceptance Criteria

1. THE Portfolio System SHALL configurar un cliente de Supabase con las credenciales del proyecto
2. THE Portfolio System SHALL crear tablas en Supabase para proyectos (id, title, category, image_url, link, created_at)
3. THE Portfolio System SHALL crear tablas en Supabase para testimonios (id, name, image_url, rating, comment, created_at)
4. THE Portfolio System SHALL crear tablas en Supabase para métricas (id, metric_type, count, last_updated)
5. THE Portfolio System SHALL utilizar Supabase Storage para almacenar imágenes de proyectos y testimonios

### Requirement 4: Gestión Dinámica de Proyectos

**User Story:** Como administrador, quiero agregar, editar y eliminar proyectos desde el panel de administración, para mantener mi portafolio actualizado sin tocar código.

#### Acceptance Criteria

1. WHEN THE Admin User accede al panel de proyectos, THE Portfolio System SHALL mostrar una lista de todos los proyectos con opciones de editar y eliminar
2. WHEN THE Admin User crea un nuevo proyecto, THE Portfolio System SHALL solicitar título, categoría (Diseño/Web/App), imagen y enlace externo
3. WHEN THE Admin User sube una imagen de proyecto, THE Portfolio System SHALL almacenarla en Supabase Storage y guardar la URL en la base de datos
4. WHEN THE Admin User edita un proyecto, THE Portfolio System SHALL actualizar los datos en la base de datos y reflejar los cambios en el sitio público inmediatamente
5. WHEN THE Admin User elimina un proyecto, THE Portfolio System SHALL remover el registro de la base de datos y la imagen asociada de Storage

### Requirement 5: Gestión Dinámica de Testimonios

**User Story:** Como administrador, quiero agregar y administrar testimonios de clientes desde el panel, para mostrar feedback actualizado en el sitio.

#### Acceptance Criteria

1. WHEN THE Admin User accede al panel de testimonios, THE Portfolio System SHALL mostrar todos los testimonios con opciones de editar y eliminar
2. WHEN THE Admin User crea un testimonio, THE Portfolio System SHALL solicitar nombre del cliente, foto, calificación (1-5 estrellas) y comentario
3. WHEN THE Admin User sube una foto de cliente, THE Portfolio System SHALL almacenarla en Supabase Storage con optimización de tamaño
4. WHEN THE Public Site muestra testimonios, THE Portfolio System SHALL renderizarlos en un carrusel Swiper igual al diseño actual
5. WHEN THE Admin User elimina un testimonio, THE Portfolio System SHALL remover el registro y la imagen asociada

### Requirement 6: Sistema de Autenticación

**User Story:** Como administrador, quiero acceder al panel mediante login seguro con email y contraseña, para proteger las funciones de administración.

#### Acceptance Criteria

1. WHEN THE Admin User navega a /admin sin autenticación, THE Portfolio System SHALL redirigir a una página de login
2. WHEN THE Admin User ingresa credenciales válidas, THE Portfolio System SHALL autenticar usando Supabase Auth y permitir acceso al panel
3. WHEN THE Admin User ingresa credenciales inválidas, THE Portfolio System SHALL mostrar un mensaje de error claro
4. WHEN THE Admin User está autenticado, THE Portfolio System SHALL mantener la sesión activa usando tokens de Supabase
5. WHEN THE Admin User cierra sesión, THE Portfolio System SHALL invalidar el token y redirigir al login

### Requirement 7: Registro de Métricas

**User Story:** Como administrador, quiero que el sistema registre automáticamente visitas al sitio y descargas del CV, para analizar el tráfico y engagement.

#### Acceptance Criteria

1. WHEN THE Visitor accede a la página principal, THE Portfolio System SHALL incrementar el contador de visitas en la base de datos
2. WHEN THE Visitor descarga el CV, THE Portfolio System SHALL incrementar el contador de descargas en la base de datos
3. THE Portfolio System SHALL almacenar métricas con timestamp para análisis temporal
4. WHEN THE Portfolio System registra una métrica, THE Portfolio System SHALL hacerlo de forma asíncrona sin afectar la experiencia del usuario
5. THE Portfolio System SHALL prevenir conteos duplicados usando identificadores de sesión o cookies temporales

### Requirement 8: Panel de Métricas y Estadísticas

**User Story:** Como administrador, quiero ver estadísticas de visitas y descargas en el panel, para entender el rendimiento del sitio.

#### Acceptance Criteria

1. WHEN THE Admin User accede al dashboard, THE Portfolio System SHALL mostrar el total de visitas al sitio
2. WHEN THE Admin User accede al dashboard, THE Portfolio System SHALL mostrar el total de descargas del CV
3. WHEN THE Admin User visualiza métricas, THE Portfolio System SHALL mostrar gráficos o tarjetas visuales con los datos
4. THE Portfolio System SHALL actualizar las métricas en tiempo real al cargar el dashboard
5. WHEN THE Portfolio System muestra estadísticas, THE Portfolio System SHALL incluir comparativas temporales (últimos 7 días, 30 días)

### Requirement 9: Página de Proyectos Completa

**User Story:** Como visitante, quiero acceder a /proyectos para ver todos los trabajos del portafolio con filtros por categoría, igual que en el sitio actual.

#### Acceptance Criteria

1. WHEN THE Visitor navega a /proyectos, THE Portfolio System SHALL mostrar todos los proyectos en una grilla responsive
2. WHEN THE Visitor usa los filtros (Todo/Diseño/Web/App), THE Portfolio System SHALL filtrar proyectos usando la misma animación MixItUp del sitio actual
3. WHEN THE Portfolio System renderiza la página de proyectos, THE Portfolio System SHALL mantener el mismo header y footer del sitio principal
4. WHEN THE Visitor hace clic en un proyecto, THE Portfolio System SHALL abrir el enlace externo en una nueva pestaña
5. THE Portfolio System SHALL cargar los proyectos dinámicamente desde Supabase en lugar de datos estáticos

### Requirement 10: Funcionalidad de Contacto

**User Story:** Como visitante, quiero enviar mensajes de contacto mediante el formulario, para comunicarme con el dueño del portafolio.

#### Acceptance Criteria

1. WHEN THE Visitor completa el formulario de contacto, THE Portfolio System SHALL validar que todos los campos requeridos estén llenos
2. WHEN THE Visitor envía el formulario, THE Portfolio System SHALL enviar el email usando EmailJS con la misma configuración actual
3. WHEN THE Portfolio System envía el email exitosamente, THE Portfolio System SHALL mostrar una notificación toast de éxito
4. WHEN THE Portfolio System falla al enviar el email, THE Portfolio System SHALL mostrar una notificación toast de error
5. THE Portfolio System SHALL mantener los mismos campos del formulario actual (nombre, contacto, servicio, mensaje)

### Requirement 11: Responsive y Accesibilidad

**User Story:** Como visitante en cualquier dispositivo, quiero que el sitio se vea y funcione perfectamente, para tener una buena experiencia sin importar mi pantalla.

#### Acceptance Criteria

1. WHEN THE Portfolio System se visualiza en móvil, THE Portfolio System SHALL adaptar el layout usando los mismos breakpoints del CSS actual (320px, 576px, 767px, 992px)
2. WHEN THE Portfolio System renderiza la navegación en móvil, THE Portfolio System SHALL mostrar el menú flotante inferior con iconos
3. THE Portfolio System SHALL mantener todas las animaciones y transiciones del diseño original en todos los dispositivos
4. THE Portfolio System SHALL asegurar que todos los elementos interactivos sean accesibles por teclado
5. THE Portfolio System SHALL incluir atributos ARIA apropiados para lectores de pantalla

### Requirement 12: Preparación para Funcionalidades Futuras

**User Story:** Como desarrollador, quiero que la arquitectura permita agregar fácilmente una sección de blogs y expandir funcionalidades, para escalar el proyecto sin refactorización mayor.

#### Acceptance Criteria

1. THE Portfolio System SHALL estructurar el código de forma modular para facilitar la adición de nuevas secciones
2. THE Portfolio System SHALL diseñar el esquema de base de datos considerando futuras tablas (blogs, categorías)
3. THE Portfolio System SHALL implementar un sistema de rutas escalable que permita agregar /blog sin conflictos
4. THE Portfolio System SHALL documentar la estructura de componentes y servicios para facilitar futuras extensiones
5. THE Portfolio System SHALL utilizar variables de entorno para configuraciones que puedan cambiar (URLs de API, claves)
