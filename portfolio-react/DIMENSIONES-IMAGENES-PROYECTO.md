# Dimensiones de Imágenes para Proyectos

## Layout de Galería - Vista de Detalle

Para lograr un layout perfecto sin espacios en blanco, usa estas dimensiones exactas al subir imágenes a Supabase:

### Dimensiones Recomendadas

Para obtener la mejor calidad en pantallas modernas (incluyendo Retina y 4K):

**Puedes subir de 1 a 5 imágenes. El sistema se adapta automáticamente.**

1. **Imagen 1 - Hero Horizontal** (OBLIGATORIA): `2400 x 1200px` (ratio 2:1)
   - Ocupa 2 columnas x 1 fila
   - Ideal para capturas panorámicas o hero images
   - **Slot separado en el admin**
   - Formato recomendado: JPG (80-90% calidad) o WebP

2. **Imagen 2 - Cuadrada** (OPCIONAL): `1200 x 1200px` (ratio 1:1)
   - Ocupa 1 columna x 1 fila
   - Posición: esquina superior derecha
   - Formato recomendado: JPG (80-90% calidad) o WebP

3. **Imagen 3 - Cuadrada** (OPCIONAL): `1200 x 1200px` (ratio 1:1)
   - Ocupa 1 columna x 1 fila
   - Posición: fila 2, columna 1
   - Formato recomendado: JPG (80-90% calidad) o WebP

4. **Imagen 4 - Cuadrada** (OPCIONAL): `1200 x 1200px` (ratio 1:1)
   - Ocupa 1 columna x 1 fila
   - Posición: fila 2, columna 2
   - Formato recomendado: JPG (80-90% calidad) o WebP

5. **Imagen 5 - Cuadrada** (OPCIONAL): `1200 x 1200px` (ratio 1:1)
   - Ocupa 1 columna x 1 fila
   - Posición: fila 2, columna 3
   - Formato recomendado: JPG (80-90% calidad) o WebP

### Dimensiones Alternativas (Más ligeras)

Si prefieres archivos más pequeños para carga rápida:

1. **Imagen Hero**: `1800 x 900px` (ratio 2:1)
2. **Imágenes Cuadradas**: `900 x 900px` (ratio 1:1)

### Ejemplos de Uso Flexible

**Proyecto con 2 imágenes:**
- Solo subes Imagen 1 (hero) + Imagen 2
- El grid se adapta y solo muestra esas 2 imágenes

**Proyecto con 3 imágenes:**
- Subes Imagen 1 (hero) + Imagen 2 + Imagen 3
- El grid muestra las 3 imágenes sin espacios vacíos

**Proyecto con 5 imágenes:**
- Subes todas las imágenes
- Layout completo como se muestra en el diagrama

## Visualización del Layout

```
┌─────────────────┬─────────┐
│                 │         │
│   Imagen 1      │ Imagen 2│
│   (1648x800)    │ (800x800)│
├────────┬────────┼─────────┤
│        │        │         │
│Imagen 3│Imagen 4│ Imagen 5│
│(800x800)│(800x800)│ (800x800)│
└────────┴────────┴─────────┘
```

## Notas Importantes

- **Cantidad flexible**: Puedes subir de 1 a 5 imágenes. No es necesario llenar todos los slots
- **Imagen 1 obligatoria**: Solo la imagen hero (primera) es obligatoria
- **Sin espacios vacíos**: El grid CSS se adapta automáticamente, no deja espacios vacíos
- **Proporciones**: Lo más importante es mantener las proporciones (2:1 para hero, 1:1 para cuadradas)
- **Calidad**: Las dimensiones recomendadas son 2x el tamaño de visualización para pantallas Retina
- **Peso**: Usa compresión JPG 80-90% o WebP para balance entre calidad y velocidad
- **Orden**: El array en Supabase: [hero, cuadrada, cuadrada, cuadrada, cuadrada] (las que subas)
- **Optimización**: Considera usar herramientas como TinyPNG, Squoosh o ImageOptim antes de subir

## Herramientas Recomendadas para Redimensionar

- **Online**: [Squoosh.app](https://squoosh.app/) - Optimiza y redimensiona
- **Desktop**: Photoshop, GIMP, o cualquier editor de imágenes
- **Batch**: ImageMagick para procesar múltiples imágenes

## Estructura en el Admin

El panel de administración tiene dos secciones separadas:

1. **Imagen Hero** (slot individual)
   - Dimensión: 1648 x 800px
   - Un solo campo de carga

2. **Galería de Imágenes** (4 slots)
   - Dimensión: 800 x 800px cada una
   - Cuatro campos de carga separados

## Ejemplo de Array en Supabase

```json
{
  "images": [
    "https://tu-bucket.supabase.co/proyecto/imagen-hero-2400x1200.jpg",
    "https://tu-bucket.supabase.co/proyecto/imagen-2-1200x1200.jpg",
    "https://tu-bucket.supabase.co/proyecto/imagen-3-1200x1200.jpg",
    "https://tu-bucket.supabase.co/proyecto/imagen-4-1200x1200.jpg",
    "https://tu-bucket.supabase.co/proyecto/imagen-5-1200x1200.jpg"
  ]
}
```

## Recomendaciones de Peso de Archivo

- **Imagen Hero (2400x1200)**: 150-300 KB (JPG 80-85%) o 100-200 KB (WebP)
- **Imágenes Cuadradas (1200x1200)**: 100-200 KB (JPG 80-85%) o 70-150 KB (WebP)
- **Total por proyecto**: Idealmente menos de 1 MB para las 5 imágenes

## Herramientas de Optimización Recomendadas

1. **Squoosh.app** - Online, gratis, excelente para WebP
2. **TinyPNG.com** - Online, gratis, muy buena compresión JPG/PNG
3. **ImageOptim** - Desktop (Mac), gratis, batch processing
4. **XnConvert** - Desktop (Windows/Mac/Linux), gratis, batch processing
