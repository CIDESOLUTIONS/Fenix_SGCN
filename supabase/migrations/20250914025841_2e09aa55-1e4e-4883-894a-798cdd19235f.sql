-- Arreglar todas las funciones que no tienen search_path configurado
DROP FUNCTION IF EXISTS public.handle_trial_signup() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_trial_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end)
  VALUES (
    NEW.id, 
    'trial', 
    now(), 
    now() + INTERVAL '30 days'
  );
  RETURN NEW;
END;
$function$;

-- Recrear triggers que se pudieron haber eliminado
CREATE TRIGGER on_auth_user_trial_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_trial_signup();