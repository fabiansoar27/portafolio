-- Actualización de la tabla testimonials para incluir nuevos campos
-- Ejecuta este SQL en tu panel de Supabase

-- Agregar nuevas columnas a la tabla testimonials
ALTER TABLE testimonials
ADD COLUMN IF NOT EXISTS how_found TEXT,
ADD COLUMN IF NOT EXISTS service_acquired TEXT,
ADD COLUMN IF NOT EXISTS improvement_aspect TEXT,
ADD COLUMN IF NOT EXISTS improvement_other TEXT,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
ADD COLUMN IF NOT EXISTS submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Actualizar testimonios existentes para que tengan status 'approved'
UPDATE testimonials 
SET status = 'approved' 
WHERE status IS NULL;

-- Crear índice para filtrar por status
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(status);

-- Comentarios para documentar
COMMENT ON COLUMN testimonials.how_found IS 'Cómo se enteró del servicio: Redes sociales, Búsqueda web, Recomendación';
COMMENT ON COLUMN testimonials.service_acquired IS 'Servicio que adquirió';
COMMENT ON COLUMN testimonials.improvement_aspect IS 'Aspecto a mejorar';
COMMENT ON COLUMN testimonials.improvement_other IS 'Otro aspecto a mejorar (especificar)';
COMMENT ON COLUMN testimonials.status IS 'Estado: pending, approved, rejected';
COMMENT ON COLUMN testimonials.submitted_at IS 'Fecha de envío del testimonio';
