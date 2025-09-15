-- Create demo data without ON CONFLICT clauses that require unique constraints
-- First create a profile for the existing user
DELETE FROM public.profiles WHERE user_id = '58e41ad9-0b51-435f-a825-2f075a48d9d7';
INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position) 
VALUES ('58e41ad9-0b51-435f-a825-2f075a48d9d7', 'Mario Cifuentes', 'CIDESAS', 'mario.cifuentes@cidesas.com', '+57-300-123-4567', 'Administrador');

-- Create subscription for existing user
DELETE FROM public.user_subscriptions WHERE user_id = '58e41ad9-0b51-435f-a825-2f075a48d9d7';
INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end)
VALUES ('58e41ad9-0b51-435f-a825-2f075a48d9d7', 'trial', now(), now() + INTERVAL '30 days');

-- Create demo data for the two companies with fixed UUIDs
DO $$
DECLARE
  demo_user1_id uuid := 'e1111111-1111-1111-1111-111111111111';
  demo_user2_id uuid := 'e2222222-2222-2222-2222-222222222222';
BEGIN
  -- Clean existing demo data
  DELETE FROM public.business_processes WHERE user_id IN (demo_user1_id, demo_user2_id);
  DELETE FROM public.user_subscriptions WHERE user_id IN (demo_user1_id, demo_user2_id);
  DELETE FROM public.profiles WHERE user_id IN (demo_user1_id, demo_user2_id);
  
  -- Create profiles for demo users
  INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position) 
  VALUES 
    (demo_user1_id, 'Carlos Rodriguez', 'Empresa1 - Tecnología Avanzada S.A.', 'usuario1@empresa1.com', '+34-600-111-111', 'Director de Continuidad'),
    (demo_user2_id, 'Ana Martinez', 'Empresa2 - Servicios Financieros Ltda.', 'usuario2@empresa2.com', '+34-600-222-222', 'Gerente de Riesgos');
  
  -- Insert business processes for Empresa1
  INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
  (gen_random_uuid(), demo_user1_id, 'Desarrollo de Software', 'Proceso principal de desarrollo y mantenimiento de aplicaciones', 'Crítico', 'Juan Pérez', 'IT', ARRAY['Infraestructura TI', 'Gestión de Proyectos'], 'Juan Pérez', 'Carlos Rodriguez', 'Equipo QA', 'Gerencia General'),
  (gen_random_uuid(), demo_user1_id, 'Soporte Técnico al Cliente', 'Atención y resolución de incidencias técnicas', 'Crítico', 'Maria González', 'Soporte', ARRAY['Sistema CRM', 'Base de Conocimientos'], 'Maria González', 'Carlos Rodriguez', 'Desarrollo', 'Ventas'),
  (gen_random_uuid(), demo_user1_id, 'Gestión de Infraestructura TI', 'Mantenimiento y operación de servidores y redes', 'Crítico', 'Pedro Sánchez', 'IT', ARRAY['Proveedores Cloud', 'Seguridad'], 'Pedro Sánchez', 'Carlos Rodriguez', 'Desarrollo', 'Todas las áreas'),
  (gen_random_uuid(), demo_user1_id, 'Facturación y Cobranza', 'Emisión de facturas y gestión de cobros', 'Crítico', 'Lucia Torres', 'Finanzas', ARRAY['Sistema ERP', 'Bancos'], 'Lucia Torres', 'Carlos Rodriguez', 'Ventas', 'Gerencia'),
  (gen_random_uuid(), demo_user1_id, 'Gestión Comercial', 'Ventas y relación con clientes', 'Crítico', 'Roberto Vila', 'Ventas', ARRAY['CRM', 'Marketing'], 'Roberto Vila', 'Carlos Rodriguez', 'Marketing', 'Gerencia');
  
  -- Insert business processes for Empresa2
  INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
  (gen_random_uuid(), demo_user2_id, 'Procesamiento de Transacciones', 'Procesamiento en tiempo real de operaciones financieras', 'Crítico', 'Miguel Herrera', 'Operaciones', ARRAY['Core Bancario', 'Redes de Pago'], 'Miguel Herrera', 'Ana Martinez', 'Riesgos', 'Regulador'),
  (gen_random_uuid(), demo_user2_id, 'Gestión de Riesgo Crediticio', 'Evaluación y seguimiento de riesgos de crédito', 'Crítico', 'Carmen López', 'Riesgos', ARRAY['Centrales de Riesgo', 'Sistema Scoring'], 'Carmen López', 'Ana Martinez', 'Auditoría', 'Comité de Riesgos'),
  (gen_random_uuid(), demo_user2_id, 'Atención al Cliente Bancario', 'Servicio integral a clientes bancarios', 'Crítico', 'David Morales', 'Servicio Cliente', ARRAY['CRM Bancario', 'Canales Digitales'], 'David Morales', 'Ana Martinez', 'Operaciones', 'Gerencia'),
  (gen_random_uuid(), demo_user2_id, 'Cumplimiento Regulatorio', 'Gestión de compliance y reportes regulatorios', 'Crítico', 'Elena Ruiz', 'Compliance', ARRAY['Sistemas Regulatorios', 'Auditoría'], 'Elena Ruiz', 'Ana Martinez', 'Legal', 'Junta Directiva'),
  (gen_random_uuid(), demo_user2_id, 'Ciberseguridad Financiera', 'Protección de activos digitales y datos', 'Crítico', 'Fernando Castro', 'Seguridad', ARRAY['SOC', 'Herramientas de Seguridad'], 'Fernando Castro', 'Ana Martinez', 'IT', 'Todas las áreas');
  
  -- Create subscriptions for demo users
  INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end)
  VALUES 
    (demo_user1_id, 'trial', now(), now() + INTERVAL '30 days'),
    (demo_user2_id, 'trial', now(), now() + INTERVAL '30 days');
END;
$$;