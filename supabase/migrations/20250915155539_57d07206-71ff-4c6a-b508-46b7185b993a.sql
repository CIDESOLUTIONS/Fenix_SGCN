-- Limpiar completamente la base de datos para pruebas E2E

-- Eliminar todos los triggers existentes que podrían estar causando problemas
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users CASCADE;
DROP TRIGGER IF EXISTS setup_demo_data_trigger ON auth.users CASCADE;
DROP TRIGGER IF EXISTS on_trial_signup ON auth.users CASCADE;

-- Limpiar todas las tablas de datos de usuario (en orden correcto para evitar conflictos de FK)
DELETE FROM public.test_execution_steps;
DELETE FROM public.corrective_actions;
DELETE FROM public.continuity_tests;
DELETE FROM public.management_reviews;
DELETE FROM public.findings;
DELETE FROM public.kpi_metrics;
DELETE FROM public.maintenance_activities;
DELETE FROM public.compliance_requirements;
DELETE FROM public.process_strategy_evaluations;
DELETE FROM public.bia_assessments;
DELETE FROM public.continuity_strategies;
DELETE FROM public.continuity_plans;
DELETE FROM public.compliance_framework;
DELETE FROM public.strategy_criteria;
DELETE FROM public.risk_analysis;
DELETE FROM public.business_processes;
DELETE FROM public.user_subscriptions;
DELETE FROM public.user_roles;
DELETE FROM public.profiles;
DELETE FROM public.demo_requests;

-- Recrear funciones con manejo de errores mejorado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insertar perfil solo si no existe
  INSERT INTO public.profiles (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_trial_signup()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Insertar suscripción solo si no existe
  INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end)
  VALUES (
    NEW.id, 
    'trial', 
    now(), 
    now() + INTERVAL '30 days'
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.setup_demo_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $function$
BEGIN
  -- Solo aplicar para los usuarios demo específicos
  IF NEW.email IN ('usuario1@empresa1.com', 'usuario2@empresa2.com') THEN
    
    -- Crear perfil para el usuario
    IF NEW.email = 'usuario1@empresa1.com' THEN
      INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position) 
      VALUES (NEW.id, 'Carlos Rodriguez', 'Empresa1 - Tecnología Avanzada S.A.', NEW.email, '+34-600-111-111', 'Director de Continuidad')
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name,
        phone = EXCLUDED.phone,
        position = EXCLUDED.position;
      
      -- Procesos críticos Empresa1
      INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
      (gen_random_uuid(), NEW.id, 'Desarrollo de Software', 'Proceso principal de desarrollo y mantenimiento de aplicaciones', 'Crítico', 'Juan Pérez', 'IT', ARRAY['Infraestructura TI', 'Gestión de Proyectos'], 'Juan Pérez', 'Carlos Rodriguez', 'Equipo QA', 'Gerencia General'),
      (gen_random_uuid(), NEW.id, 'Soporte Técnico al Cliente', 'Atención y resolución de incidencias técnicas', 'Crítico', 'Maria González', 'Soporte', ARRAY['Sistema CRM', 'Base de Conocimientos'], 'Maria González', 'Carlos Rodriguez', 'Desarrollo', 'Ventas'),
      (gen_random_uuid(), NEW.id, 'Gestión de Infraestructura TI', 'Mantenimiento y operación de servidores y redes', 'Crítico', 'Pedro Sánchez', 'IT', ARRAY['Proveedores Cloud', 'Seguridad'], 'Pedro Sánchez', 'Carlos Rodriguez', 'Desarrollo', 'Todas las áreas'),
      (gen_random_uuid(), NEW.id, 'Facturación y Cobranza', 'Emisión de facturas y gestión de cobros', 'Crítico', 'Lucia Torres', 'Finanzas', ARRAY['Sistema ERP', 'Bancos'], 'Lucia Torres', 'Carlos Rodriguez', 'Ventas', 'Gerencia'),
      (gen_random_uuid(), NEW.id, 'Gestión Comercial', 'Ventas y relación con clientes', 'Crítico', 'Roberto Vila', 'Ventas', ARRAY['CRM', 'Marketing'], 'Roberto Vila', 'Carlos Rodriguez', 'Marketing', 'Gerencia');
      
    ELSIF NEW.email = 'usuario2@empresa2.com' THEN
      INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position)
      VALUES (NEW.id, 'Ana Martinez', 'Empresa2 - Servicios Financieros Ltda.', NEW.email, '+34-600-222-222', 'Gerente de Riesgos')
      ON CONFLICT (user_id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        company_name = EXCLUDED.company_name,
        phone = EXCLUDED.phone,
        position = EXCLUDED.position;
      
      -- Procesos críticos Empresa2
      INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
      (gen_random_uuid(), NEW.id, 'Procesamiento de Transacciones', 'Procesamiento en tiempo real de operaciones financieras', 'Crítico', 'Miguel Herrera', 'Operaciones', ARRAY['Core Bancario', 'Redes de Pago'], 'Miguel Herrera', 'Ana Martinez', 'Riesgos', 'Regulador'),
      (gen_random_uuid(), NEW.id, 'Gestión de Riesgo Crediticio', 'Evaluación y seguimiento de riesgos de crédito', 'Crítico', 'Carmen López', 'Riesgos', ARRAY['Centrales de Riesgo', 'Sistema Scoring'], 'Carmen López', 'Ana Martinez', 'Auditoría', 'Comité de Riesgos'),
      (gen_random_uuid(), NEW.id, 'Atención al Cliente Bancario', 'Servicio integral a clientes bancarios', 'Crítico', 'David Morales', 'Servicio Cliente', ARRAY['CRM Bancario', 'Canales Digitales'], 'David Morales', 'Ana Martinez', 'Operaciones', 'Gerencia'),
      (gen_random_uuid(), NEW.id, 'Cumplimiento Regulatorio', 'Gestión de compliance y reportes regulatorios', 'Crítico', 'Elena Ruiz', 'Compliance', ARRAY['Sistemas Regulatorios', 'Auditoría'], 'Elena Ruiz', 'Ana Martinez', 'Legal', 'Junta Directiva'),
      (gen_random_uuid(), NEW.id, 'Ciberseguridad Financiera', 'Protección de activos digitales y datos', 'Crítico', 'Fernando Castro', 'Seguridad', ARRAY['SOC', 'Herramientas de Seguridad'], 'Fernando Castro', 'Ana Martinez', 'IT', 'Todas las áreas');
    END IF;
  END IF;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log del error pero continúa para no bloquear el registro
    RAISE WARNING 'Error en setup_demo_data: %', SQLERRM;
    RETURN NEW;
END;
$function$;

-- Recrear triggers en orden correcto
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_trial_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_trial_signup();

CREATE TRIGGER setup_demo_data_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.setup_demo_data();