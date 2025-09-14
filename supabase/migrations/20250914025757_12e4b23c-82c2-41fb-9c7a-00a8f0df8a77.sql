-- Crear el trigger para auto-setup de datos demo
CREATE TRIGGER setup_demo_data_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.setup_demo_data();

-- Arreglar el warning de search_path para la función existente handle_new_user
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- CORREGIDO: Inserta en 'user_id' en lugar de 'id'
  INSERT INTO public.profiles (user_id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$function$;

-- Recrear el trigger para handle_new_user si no existe
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();