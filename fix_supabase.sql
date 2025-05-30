-- Corregir la política de seguridad para permitir el acceso a todos los cursos
alter policy "Users can view their own courses"
on "public"."courses"
to authenticated
using (true);

-- Eliminar la función RPC existente si existe
drop function if exists get_user_courses_with_modules(uuid);

-- Crear la función RPC con más información de depuración y manejo de errores
create or replace function get_user_courses_with_modules(user_id uuid)
returns table (
  course_id uuid,
  course_name text,
  course_preview_image text,
  enabled_modules jsonb,
  disabled_modules jsonb
) language plpgsql security definer as $$
declare
  v_user_id uuid;
  v_course_count int;
  v_module_count int;
  v_user_module_count int;
begin
  -- Asignar el parámetro a una variable local
  v_user_id := user_id;
  
  -- Verificar si el usuario existe
  if not exists (select 1 from auth.users where id = v_user_id) then
    raise exception 'Usuario no encontrado: %', v_user_id;
  end if;
  
  -- Contar cursos
  select count(*) into v_course_count from courses;
  
  -- Contar módulos
  select count(*) into v_module_count from modules;
  
  -- Contar módulos del usuario
  select count(*) into v_user_module_count from user_modules where user_id = v_user_id;
  
  -- Registrar información de depuración
  raise notice 'Usuario: %, Cursos: %, Módulos: %, Módulos del usuario: %', 
    v_user_id, v_course_count, v_module_count, v_user_module_count;
  
  -- Devolver los cursos y módulos
  return query
  with user_enabled_modules as (
    select module_id 
    from user_modules 
    where user_id = v_user_id
  )
  select 
    c.id as course_id,
    c.name as course_name,
    c.preview_image as course_preview_image,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'name', m.name,
          'is_paid', coalesce(m.is_paid, false)
        )
      ) filter (where m.id in (select module_id from user_enabled_modules)),
      '[]'::jsonb
    ) as enabled_modules,
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', m.id,
          'name', m.name,
          'is_paid', coalesce(m.is_paid, false)
        )
      ) filter (where m.id not in (select module_id from user_enabled_modules)),
      '[]'::jsonb
    ) as disabled_modules
  from courses c
  left join modules m on m.course_id = c.id
  group by c.id, c.name, c.preview_image
  order by c.created_at desc;
end;
$$; 