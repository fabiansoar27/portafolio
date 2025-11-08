# Sistema de Testimonios - Instrucciones de Completación

## ✅ Lo que ya está implementado:

1. **Base de datos actualizada** - SQL en `SUPABASE-TESTIMONIALS-UPDATE.sql`
2. **Componente TestimonialPopup** - Formulario completo con todos los campos
3. **Estilos CSS** - Popup responsive y atractivo
4. **Footer actualizado** - Botón "Opinar" abre el popup
5. **Servicios actualizados** - Funciones de aprobar/rechazar
6. **Hook actualizado** - Solo muestra testimonios aprobados en el frontend

## 🔧 Pasos para completar:

### 1. Ejecutar SQL en Supabase

Abre tu panel de Supabase y ejecuta el contenido de `SUPABASE-TESTIMONIALS-UPDATE.sql` en el SQL Editor.

### 2. Actualizar TestimonialsAdmin.jsx

Agrega los filtros y botones de acción. Busca la línea con `<div className="admin-section-header">` y reemplaza toda esa sección con:

```jsx
<div className="admin-section-header">
  <h2 className="admin-section-title">
    Testimonios ({testimonials.length})
  </h2>
  
  {/* Filtros por estado */}
  <div className="admin-filters">
    <button 
      className={`admin-filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
      onClick={() => setStatusFilter('all')}
    >
      Todos
    </button>
    <button 
      className={`admin-filter-btn ${statusFilter === 'pending' ? 'active' : ''}`}
      onClick={() => setStatusFilter('pending')}
    >
      Pendientes
    </button>
    <button 
      className={`admin-filter-btn ${statusFilter === 'approved' ? 'active' : ''}`}
      onClick={() => setStatusFilter('approved')}
    >
      Aprobados
    </button>
    <button 
      className={`admin-filter-btn ${statusFilter === 'rejected' ? 'active' : ''}`}
      onClick={() => setStatusFilter('rejected')}
    >
      Rechazados
    </button>
  </div>

  <button 
    onClick={() => setShowForm(true)}
    className="admin-button"
  >
    <i className='bx bx-plus'></i>
    Nuevo Testimonio
  </button>
</div>
```

### 3. Actualizar las tarjetas de testimonios

Busca donde se renderizan las tarjetas de testimonios y agrega los botones de aprobar/rechazar. Dentro del mapeo de testimonials, agrega:

```jsx
{/* Badge de estado */}
<span className={`testimonial-status testimonial-status--${testimonial.status || 'pending'}`}>
  {testimonial.status === 'approved' ? 'Aprobado' : 
   testimonial.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
</span>

{/* Información adicional del formulario */}
{testimonial.how_found && (
  <p className="testimonial-info">
    <strong>Cómo nos encontró:</strong> {testimonial.how_found}
  </p>
)}
{testimonial.service_acquired && (
  <p className="testimonial-info">
    <strong>Servicio:</strong> {testimonial.service_acquired}
  </p>
)}
{testimonial.improvement_aspect && (
  <p className="testimonial-info">
    <strong>Aspecto a mejorar:</strong> {testimonial.improvement_aspect}
    {testimonial.improvement_other && ` - ${testimonial.improvement_other}`}
  </p>
)}

{/* Botones de acción */}
<div className="testimonial-actions">
  {testimonial.status !== 'approved' && (
    <button
      onClick={() => handleApprove(testimonial.id)}
      className="admin-action-btn admin-action-btn--approve"
      title="Aprobar"
    >
      <i className='bx bx-check'></i>
      Aprobar
    </button>
  )}
  
  {testimonial.status !== 'rejected' && (
    <button
      onClick={() => handleReject(testimonial.id)}
      className="admin-action-btn admin-action-btn--reject"
      title="Rechazar"
    >
      <i className='bx bx-x'></i>
      Rechazar
    </button>
  )}
  
  <button
    onClick={() => handleEdit(testimonial)}
    className="admin-action-btn admin-action-btn--edit"
    title="Editar"
  >
    <i className='bx bx-edit'></i>
  </button>
  
  <button
    onClick={() => handleDelete(testimonial)}
    className="admin-action-btn admin-action-btn--delete"
    title="Eliminar"
    disabled={deletingId === testimonial.id}
  >
    {deletingId === testimonial.id ? (
      <i className='bx bx-loader-alt bx-spin'></i>
    ) : (
      <i className='bx bx-trash'></i>
    )}
  </button>
</div>
```

### 4. Agregar estilos CSS para los nuevos elementos

Agrega al final de `styles.css`:

```css
/* Admin Filters */
.admin-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.admin-filter-btn {
  padding: 0.5rem 1rem;
  border: 2px solid hsl(var(--second-hue), 20%, 90%);
  background-color: var(--body-color);
  color: var(--text-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.3s;
  font-size: var(--small-font-size);
  font-weight: var(--font-medium);
}

.admin-filter-btn:hover {
  border-color: var(--first-color);
  color: var(--first-color);
}

.admin-filter-btn.active {
  background-color: var(--first-color);
  border-color: var(--first-color);
  color: #fff;
}

/* Testimonial Status Badge */
.testimonial-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 0.25rem;
  font-size: var(--tiny-font-size);
  font-weight: var(--font-semi-bold);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.testimonial-status--pending {
  background-color: hsla(45, 100%, 50%, 0.1);
  color: hsl(45, 100%, 40%);
}

.testimonial-status--approved {
  background-color: hsla(120, 60%, 50%, 0.1);
  color: hsl(120, 60%, 35%);
}

.testimonial-status--rejected {
  background-color: hsla(0, 70%, 50%, 0.1);
  color: hsl(0, 70%, 40%);
}

/* Testimonial Info */
.testimonial-info {
  font-size: var(--small-font-size);
  color: var(--text-color);
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.testimonial-info strong {
  color: var(--title-color);
  font-weight: var(--font-semi-bold);
}

/* Testimonial Actions */
.testimonial-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.admin-action-btn {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: var(--small-font-size);
  font-weight: var(--font-medium);
  transition: all 0.3s;
}

.admin-action-btn--approve {
  background-color: hsla(120, 60%, 50%, 0.1);
  color: hsl(120, 60%, 35%);
}

.admin-action-btn--approve:hover {
  background-color: hsl(120, 60%, 50%);
  color: #fff;
}

.admin-action-btn--reject {
  background-color: hsla(0, 70%, 50%, 0.1);
  color: hsl(0, 70%, 40%);
}

.admin-action-btn--reject:hover {
  background-color: hsl(0, 70%, 50%);
  color: #fff;
}

.admin-action-btn--edit {
  background-color: hsla(210, 100%, 50%, 0.1);
  color: hsl(210, 100%, 40%);
}

.admin-action-btn--edit:hover {
  background-color: hsl(210, 100%, 50%);
  color: #fff;
}

.admin-action-btn--delete {
  background-color: hsla(0, 0%, 50%, 0.1);
  color: hsl(0, 0%, 40%);
}

.admin-action-btn--delete:hover {
  background-color: hsl(0, 0%, 50%);
  color: #fff;
}

.admin-action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 🎯 Resultado Final:

- ✅ Los usuarios pueden enviar testimonios desde el footer
- ✅ Los testimonios llegan con estado "pending"
- ✅ En el admin puedes filtrar por: Todos, Pendientes, Aprobados, Rechazados
- ✅ Puedes aprobar, rechazar, editar o eliminar testimonios
- ✅ Solo los testimonios aprobados aparecen en el frontend público
- ✅ Toda la información del formulario se guarda (cómo nos encontró, servicio, mejoras, etc.)

## 📝 Notas:

- El tamaño máximo de imagen es 2 MB
- Las imágenes se suben a Supabase Storage en la carpeta `testimonials/`
- Los testimonios pendientes no se muestran en el sitio público
- Puedes crear testimonios manualmente desde el admin si lo necesitas
