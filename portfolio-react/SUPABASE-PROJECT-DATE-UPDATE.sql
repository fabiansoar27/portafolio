-- Cambiar el tipo de columna project_date de DATE a TEXT
-- Ejecuta este SQL en tu panel de Supabase

-- Cambiar el tipo de la columna project_date a TEXT
ALTER TABLE projects 
ALTER COLUMN project_date TYPE TEXT;

-- Comentario para documentar
COMMENT ON COLUMN projects.project_date IS 'Fecha del proyecto: puede ser solo año (2024) o fecha completa (2024-03-15)';
