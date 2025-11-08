-- Migration: Add project details fields
-- Fecha: 2025-10-30
-- Descripción: Agregar campos para página de detalles de proyectos

-- ============================================
-- 1. AGREGAR NUEVOS CAMPOS A LA TABLA PROJECTS
-- ============================================

-- Agregar campo de fecha del proyecto
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS project_date DATE DEFAULT CURRENT_DATE;

-- Agregar campo para múltiples imágenes (array de URLs)
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Hacer el campo link opcional (ya no será externo)
ALTER TABLE projects 
ALTER COLUMN link DROP NOT NULL;

-- ============================================
-- 2. COMENTARIOS PARA DOCUMENTACIÓN
-- ============================================

COMMENT ON COLUMN projects.project_date IS 'Fecha del proyecto para mostrar en detalles';
COMMENT ON COLUMN projects.images IS 'Array de URLs de imágenes adicionales del proyecto';
COMMENT ON COLUMN projects.image_url IS 'Imagen principal/portada del proyecto';
COMMENT ON COLUMN projects.link IS 'Link externo opcional del proyecto (si aplica)';

-- ============================================
-- 3. ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

-- Índice para búsquedas por categoría
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);

-- Índice para ordenar por fecha
CREATE INDEX IF NOT EXISTS idx_projects_date ON projects(project_date DESC);

-- ============================================
-- NOTAS DE MIGRACIÓN
-- ============================================

-- Ejecutar este script en el SQL Editor de Supabase
-- Los proyectos existentes mantendrán sus datos actuales
-- Los nuevos campos tendrán valores por defecto:
--   - project_date: fecha actual
--   - images: array vacío
--   - link: puede ser NULL

-- IMPORTANTE: Las imágenes se subirán a Supabase Storage
-- image_url e images contendrán URLs de Supabase Storage
-- Formato: https://[project-id].supabase.co/storage/v1/object/public/portfolio-images/[filename]
