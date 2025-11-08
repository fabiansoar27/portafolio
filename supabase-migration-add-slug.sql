-- Migration: Add slug field for friendly URLs
-- Fecha: 2025-10-30
-- Descripción: Agregar campo slug para URLs amigables

-- Agregar campo slug
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Crear índice para búsquedas por slug
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);

-- Comentario para documentación
COMMENT ON COLUMN projects.slug IS 'URL amigable del proyecto (ej: diseno-de-marca-casa-dulce)';

-- Generar slugs para proyectos existentes (basado en título)
UPDATE projects 
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      REGEXP_REPLACE(title, '[áàäâ]', 'a', 'g'),
      '[éèëê]', 'e', 'g'
    ),
    '[^a-z0-9]+', '-', 'g'
  )
)
WHERE slug IS NULL;
