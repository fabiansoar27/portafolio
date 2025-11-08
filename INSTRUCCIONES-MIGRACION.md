# Instrucciones para Migración de Base de Datos

## Paso 1: Configurar Supabase Storage (si no existe)

1. Ve a tu proyecto en Supabase: https://supabase.com/dashboard
2. En el menú lateral, haz clic en **Storage**
3. Si no existe el bucket `portfolio-images`, créalo:
   - Haz clic en **New bucket**
   - Nombre: `portfolio-images`
   - **Public bucket**: ✅ Activado (importante para que las imágenes sean públicas)
   - Haz clic en **Create bucket**

## Paso 2: Ejecutar la migración en Supabase

1. En el menú lateral, haz clic en **SQL Editor**
2. Haz clic en **New Query**
3. Copia y pega el contenido del archivo `supabase-migration-project-details.sql`
4. Haz clic en **Run** para ejecutar la migración

## Paso 3: Verificar que la migración se ejecutó correctamente

1. Ve a **Table Editor** en el menú lateral
2. Selecciona la tabla `projects`
3. Verifica que aparezcan los nuevos campos:
   - `project_date` (tipo: date)
   - `images` (tipo: text[])

## Paso 4: Subir imágenes de prueba (opcional)

Para probar la funcionalidad, puedes subir algunas imágenes manualmente:

1. Ve a **Storage** > **portfolio-images**
2. Haz clic en **Upload file**
3. Sube algunas imágenes de prueba
4. Copia la URL pública de cada imagen (botón "Copy URL")

## Paso 5: Agregar datos de prueba

Ahora puedes agregar proyectos de prueba con los nuevos campos. Ejemplo:

```sql
INSERT INTO projects (title, category, image_url, description, project_date, images, link)
VALUES (
  'Diseño de Marca - Café Aroma',
  'Diseño',
  'https://qhwnvwqurtqpgafdutto.supabase.co/storage/v1/object/public/portfolio-images/proyecto-cafe-portada.jpg',
  'Creación completa de identidad visual para cafetería boutique. Incluye diseño de logotipo, paleta de colores, tipografía y aplicaciones en diferentes medios.',
  '2025-10-15',
  ARRAY[
    'https://qhwnvwqurtqpgafdutto.supabase.co/storage/v1/object/public/portfolio-images/proyecto-cafe-1.jpg',
    'https://qhwnvwqurtqpgafdutto.supabase.co/storage/v1/object/public/portfolio-images/proyecto-cafe-2.jpg',
    'https://qhwnvwqurtqpgafdutto.supabase.co/storage/v1/object/public/portfolio-images/proyecto-cafe-3.jpg'
  ],
  NULL
);
```

## Campos del proyecto:

- **title**: Nombre del proyecto (requerido)
- **category**: Categoría (Diseño, Web, App) (requerido)
- **image_url**: URL de imagen principal/miniatura desde Supabase Storage (requerido)
- **description**: Descripción completa del proyecto (opcional)
- **project_date**: Fecha del proyecto (opcional, por defecto fecha actual)
- **images**: Array de URLs de imágenes adicionales desde Supabase Storage (opcional)
- **link**: Link externo si aplica (opcional)

## Notas importantes:

- ✅ Los proyectos existentes NO se verán afectados
- ✅ Los nuevos campos tendrán valores por defecto si no se especifican
- ✅ El campo `link` ahora es opcional (antes era requerido)
- ✅ **Todas las imágenes se subirán a Supabase Storage desde el panel de admin**
- ✅ Las URLs de las imágenes seguirán el formato: `https://[project-id].supabase.co/storage/v1/object/public/portfolio-images/[filename]`

## Próximos pasos:

1. ✅ Ejecutar la migración SQL
2. ✅ Configurar el bucket de Storage
3. ⏳ Implementar el panel de administración para subir imágenes
4. ⏳ Agregar proyectos desde el panel de admin
5. ⏳ Probar la página de detalles en: `http://localhost:5173/proyectos/[id-del-proyecto]`

## Flujo de trabajo para imágenes:

### Desde el panel de admin (próximamente):
1. Admin sube imagen(s) desde el formulario
2. Las imágenes se suben automáticamente a Supabase Storage
3. Las URLs se guardan en la base de datos
4. Las imágenes se muestran en el portafolio público

### Servicio de Storage creado:
- `uploadImage()` - Sube una imagen
- `uploadMultipleImages()` - Sube múltiples imágenes
- `deleteImage()` - Elimina una imagen
- `validateImageFile()` - Valida tipo y tamaño de archivo

**Nota**: El servicio de Storage ya está listo en `src/services/storageService.js` para ser usado en el panel de administración.
