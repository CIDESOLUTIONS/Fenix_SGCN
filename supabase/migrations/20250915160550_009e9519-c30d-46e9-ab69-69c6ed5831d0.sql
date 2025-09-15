-- Insert demo profiles directly
INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position) 
VALUES 
  (gen_random_uuid(), 'Carlos Rodriguez', 'Empresa1 - Tecnología Avanzada S.A.', 'usuario1@empresa1.com', '+34-600-111-111', 'Director de Continuidad'),
  (gen_random_uuid(), 'Ana Martinez', 'Empresa2 - Servicios Financieros Ltda.', 'usuario2@empresa2.com', '+34-600-222-222', 'Gerente de Riesgos')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name,
  company_name = EXCLUDED.company_name,
  phone = EXCLUDED.phone,
  position = EXCLUDED.position;

-- Get the user IDs for demo data
DO $$
DECLARE
  user1_id uuid;
  user2_id uuid;
BEGIN
  -- Get or create user IDs for demo profiles
  SELECT user_id INTO user1_id FROM profiles WHERE email = 'usuario1@empresa1.com' LIMIT 1;
  SELECT user_id INTO user2_id FROM profiles WHERE email = 'usuario2@empresa2.com' LIMIT 1;
  
  -- Insert business processes for Empresa1
  IF user1_id IS NOT NULL THEN
    INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
    (gen_random_uuid(), user1_id, 'Desarrollo de Software', 'Proceso principal de desarrollo y mantenimiento de aplicaciones', 'Crítico', 'Juan Pérez', 'IT', ARRAY['Infraestructura TI', 'Gestión de Proyectos'], 'Juan Pérez', 'Carlos Rodriguez', 'Equipo QA', 'Gerencia General'),
    (gen_random_uuid(), user1_id, 'Soporte Técnico al Cliente', 'Atención y resolución de incidencias técnicas', 'Crítico', 'Maria González', 'Soporte', ARRAY['Sistema CRM', 'Base de Conocimientos'], 'Maria González', 'Carlos Rodriguez', 'Desarrollo', 'Ventas'),
    (gen_random_uuid(), user1_id, 'Gestión de Infraestructura TI', 'Mantenimiento y operación de servidores y redes', 'Crítico', 'Pedro Sánchez', 'IT', ARRAY['Proveedores Cloud', 'Seguridad'], 'Pedro Sánchez', 'Carlos Rodriguez', 'Desarrollo', 'Todas las áreas'),
    (gen_random_uuid(), user1_id, 'Facturación y Cobranza', 'Emisión de facturas y gestión de cobros', 'Crítico', 'Lucia Torres', 'Finanzas', ARRAY['Sistema ERP', 'Bancos'], 'Lucia Torres', 'Carlos Rodriguez', 'Ventas', 'Gerencia'),
    (gen_random_uuid(), user1_id, 'Gestión Comercial', 'Ventas y relación con clientes', 'Crítico', 'Roberto Vila', 'Ventas', ARRAY['CRM', 'Marketing'], 'Roberto Vila', 'Carlos Rodriguez', 'Marketing', 'Gerencia')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Insert business processes for Empresa2  
  IF user2_id IS NOT NULL THEN
    INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
    (gen_random_uuid(), user2_id, 'Procesamiento de Transacciones', 'Procesamiento en tiempo real de operaciones financieras', 'Crítico', 'Miguel Herrera', 'Operaciones', ARRAY['Core Bancario', 'Redes de Pago'], 'Miguel Herrera', 'Ana Martinez', 'Riesgos', 'Regulador'),
    (gen_random_uuid(), user2_id, 'Gestión de Riesgo Crediticio', 'Evaluación y seguimiento de riesgos de crédito', 'Crítico', 'Carmen López', 'Riesgos', ARRAY['Centrales de Riesgo', 'Sistema Scoring'], 'Carmen López', 'Ana Martinez', 'Auditoría', 'Comité de Riesgos'),
    (gen_random_uuid(), user2_id, 'Atención al Cliente Bancario', 'Servicio integral a clientes bancarios', 'Crítico', 'David Morales', 'Servicio Cliente', ARRAY['CRM Bancario', 'Canales Digitales'], 'David Morales', 'Ana Martinez', 'Operaciones', 'Gerencia'),
    (gen_random_uuid(), user2_id, 'Cumplimiento Regulatorio', 'Gestión de compliance y reportes regulatorios', 'Crítico', 'Elena Ruiz', 'Compliance', ARRAY['Sistemas Regulatorios', 'Auditoría'], 'Elena Ruiz', 'Ana Martinez', 'Legal', 'Junta Directiva'),
    (gen_random_uuid(), user2_id, 'Ciberseguridad Financiera', 'Protección de activos digitales y datos', 'Crítico', 'Fernando Castro', 'Seguridad', ARRAY['SOC', 'Herramientas de Seguridad'], 'Fernando Castro', 'Ana Martinez', 'IT', 'Todas las áreas')
    ON CONFLICT DO NOTHING;
  END IF;
  
  -- Create subscriptions for demo users
  IF user1_id IS NOT NULL THEN
    INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end)
    VALUES (user1_id, 'trial', now(), now() + INTERVAL '30 days')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  
  IF user2_id IS NOT NULL THEN
    INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end)
    VALUES (user2_id, 'trial', now(), now() + INTERVAL '30 days')
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
END;
$$;