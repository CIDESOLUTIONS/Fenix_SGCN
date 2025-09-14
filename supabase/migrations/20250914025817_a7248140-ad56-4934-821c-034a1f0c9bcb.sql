-- Crear trigger para auto-popular datos demo cuando se registren usuarios específicos
DROP TRIGGER IF EXISTS setup_demo_data_trigger ON auth.users;

CREATE TRIGGER setup_demo_data_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.setup_demo_data();