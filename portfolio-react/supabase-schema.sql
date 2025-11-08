-- Portfolio React Migration - Database Schema
-- ✅ ESTE ESQUEMA YA FUE EJECUTADO EN SUPABASE
-- Guardado como referencia

-- ============================================
-- 1. CREATE TABLES
-- ============================================

-- Tabla de proyectos
CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de testimonios
CREATE TABLE testimonials (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  rating INTEGER DEFAULT 5,
  comment TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de visitas
CREATE TABLE visits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de descargas de CV
CREATE TABLE cv_downloads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE visits ENABLE ROW LEVEL SECURITY;
ALTER TABLE cv_downloads ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 3. CREATE RLS POLICIES
-- ============================================

-- Políticas de lectura pública
CREATE POLICY "Public can view projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public can view testimonials" ON testimonials FOR SELECT USING (true);

-- Políticas de escritura (solo usuarios autenticados)
CREATE POLICY "Authenticated users can insert projects" ON projects FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update projects" ON projects FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete projects" ON projects FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert testimonials" ON testimonials FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update testimonials" ON testimonials FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete testimonials" ON testimonials FOR DELETE USING (auth.role() = 'authenticated');

-- Políticas para visitas y descargas
CREATE POLICY "Anyone can insert visits" ON visits FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert downloads" ON cv_downloads FOR INSERT WITH CHECK (true);
CREATE POLICY "Authenticated can view stats" ON visits FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated can view downloads" ON cv_downloads FOR SELECT USING (auth.role() = 'authenticated');
