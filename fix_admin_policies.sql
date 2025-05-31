-- Corregir las políticas de RLS para permitir actualizaciones de cursos por administradores

-- Primero, eliminar las políticas existentes si existen
DROP POLICY IF EXISTS "Admins can manage courses" ON public.courses;
DROP POLICY IF EXISTS "Users can view their own courses" ON public.courses;

-- Crear nueva política para que los administradores puedan gestionar cursos
-- Usando la tabla profiles en lugar de users.raw_user_meta_data
CREATE POLICY "Admins can manage courses" ON public.courses
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id 
    FROM public.profiles 
    WHERE is_admin = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id 
    FROM public.profiles 
    WHERE is_admin = true
  )
);

-- Política para que los usuarios puedan ver cursos (solo lectura)
CREATE POLICY "Users can view courses" ON public.courses
FOR SELECT
TO authenticated
USING (true);

-- También actualizar políticas para módulos si es necesario
DROP POLICY IF EXISTS "Admins can manage modules" ON public.modules;

CREATE POLICY "Admins can manage modules" ON public.modules
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id 
    FROM public.profiles 
    WHERE is_admin = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id 
    FROM public.profiles 
    WHERE is_admin = true
  )
);

-- Política para que los usuarios puedan ver módulos
CREATE POLICY "Users can view modules" ON public.modules
FOR SELECT
TO authenticated
USING (true);

-- También actualizar políticas para lecciones
DROP POLICY IF EXISTS "Admins can manage lessons" ON public.lessons;

CREATE POLICY "Admins can manage lessons" ON public.lessons
FOR ALL
TO authenticated
USING (
  auth.uid() IN (
    SELECT id 
    FROM public.profiles 
    WHERE is_admin = true
  )
)
WITH CHECK (
  auth.uid() IN (
    SELECT id 
    FROM public.profiles 
    WHERE is_admin = true
  )
);

-- Política para que los usuarios puedan ver lecciones
CREATE POLICY "Users can view lessons" ON public.lessons
FOR SELECT
TO authenticated
USING (true);

-- Función RPC para actualizar cursos como administrador (bypass RLS)
CREATE OR REPLACE FUNCTION update_course_as_admin(
  course_id uuid,
  course_name text,
  course_preview_image text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  -- Verificar si el usuario es administrador
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: user is not an admin';
  END IF;

  -- Actualizar el curso
  UPDATE public.courses 
  SET 
    name = course_name,
    preview_image = course_preview_image,
    updated_at = now()
  WHERE id = course_id;

  -- Verificar si se actualizó algún registro
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Course not found with id: %', course_id;
  END IF;
END;
$$;

-- Función RPC para actualizar módulos como administrador (bypass RLS)
CREATE OR REPLACE FUNCTION update_module_as_admin(
  module_id uuid,
  module_name text,
  module_is_paid boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY definer
AS $$
BEGIN
  -- Verificar si el usuario es administrador
  IF NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) THEN
    RAISE EXCEPTION 'Access denied: user is not an admin';
  END IF;

  -- Actualizar el módulo
  UPDATE public.modules 
  SET 
    name = module_name,
    is_paid = module_is_paid,
    updated_at = now()
  WHERE id = module_id;

  -- Verificar si se actualizó algún registro
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Module not found with id: %', module_id;
  END IF;
END;
$$;
