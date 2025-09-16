-- Limpiar completamente todos los datos existentes
DELETE FROM auth.users WHERE email != 'admin@example.com';

-- Insertar usuarios de prueba directamente en auth.users
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES 
(
  '11111111-1111-1111-1111-111111111111',
  'usuario1@empresa1.com',
  crypt('TestPass123!', gen_salt('bf')),
  now(),
  '{"full_name": "Carlos Rodriguez", "company_name": "Empresa1 - Tecnología Avanzada S.A.", "position": "Director de Continuidad", "phone": "+34-600-111-111"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
),
(
  '22222222-2222-2222-2222-222222222222',
  'usuario2@empresa2.com',
  crypt('TestPass123!', gen_salt('bf')),
  now(),
  '{"full_name": "Ana Martinez", "company_name": "Empresa2 - Servicios Financieros Ltda.", "position": "Gerente de Riesgos", "phone": "+34-600-222-222"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
);

-- Insertar perfiles directamente
INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position) VALUES
('11111111-1111-1111-1111-111111111111', 'Carlos Rodriguez', 'Empresa1 - Tecnología Avanzada S.A.', 'usuario1@empresa1.com', '+34-600-111-111', 'Director de Continuidad'),
('22222222-2222-2222-2222-222222222222', 'Ana Martinez', 'Empresa2 - Servicios Financieros Ltda.', 'usuario2@empresa2.com', '+34-600-222-222', 'Gerente de Riesgos');

-- Insertar suscripciones
INSERT INTO public.user_subscriptions (user_id, plan_type, trial_start, trial_end) VALUES
('11111111-1111-1111-1111-111111111111', 'trial', now(), now() + INTERVAL '30 days'),
('22222222-2222-2222-2222-222222222222', 'trial', now(), now() + INTERVAL '30 days');

-- Procesos críticos para Empresa1
INSERT INTO business_processes (user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
('11111111-1111-1111-1111-111111111111', 'Desarrollo de Software', 'Proceso principal de desarrollo y mantenimiento de aplicaciones', 'Crítico', 'Juan Pérez', 'IT', ARRAY['Infraestructura TI', 'Gestión de Proyectos'], 'Juan Pérez', 'Carlos Rodriguez', 'Equipo QA', 'Gerencia General'),
('11111111-1111-1111-1111-111111111111', 'Soporte Técnico al Cliente', 'Atención y resolución de incidencias técnicas', 'Crítico', 'Maria González', 'Soporte', ARRAY['Sistema CRM', 'Base de Conocimientos'], 'Maria González', 'Carlos Rodriguez', 'Desarrollo', 'Ventas'),
('11111111-1111-1111-1111-111111111111', 'Gestión de Infraestructura TI', 'Mantenimiento y operación de servidores y redes', 'Crítico', 'Pedro Sánchez', 'IT', ARRAY['Proveedores Cloud', 'Seguridad'], 'Pedro Sánchez', 'Carlos Rodriguez', 'Desarrollo', 'Todas las áreas'),
('11111111-1111-1111-1111-111111111111', 'Facturación y Cobranza', 'Emisión de facturas y gestión de cobros', 'Crítico', 'Lucia Torres', 'Finanzas', ARRAY['Sistema ERP', 'Bancos'], 'Lucia Torres', 'Carlos Rodriguez', 'Ventas', 'Gerencia'),
('11111111-1111-1111-1111-111111111111', 'Gestión Comercial', 'Ventas y relación con clientes', 'Crítico', 'Roberto Vila', 'Ventas', ARRAY['CRM', 'Marketing'], 'Roberto Vila', 'Carlos Rodriguez', 'Marketing', 'Gerencia');

-- Procesos críticos para Empresa2
INSERT INTO business_processes (user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
('22222222-2222-2222-2222-222222222222', 'Procesamiento de Transacciones', 'Procesamiento en tiempo real de operaciones financieras', 'Crítico', 'Miguel Herrera', 'Operaciones', ARRAY['Core Bancario', 'Redes de Pago'], 'Miguel Herrera', 'Ana Martinez', 'Riesgos', 'Regulador'),
('22222222-2222-2222-2222-222222222222', 'Gestión de Riesgo Crediticio', 'Evaluación y seguimiento de riesgos de crédito', 'Crítico', 'Carmen López', 'Riesgos', ARRAY['Centrales de Riesgo', 'Sistema Scoring'], 'Carmen López', 'Ana Martinez', 'Auditoría', 'Comité de Riesgos'),
('22222222-2222-2222-2222-222222222222', 'Atención al Cliente Bancario', 'Servicio integral a clientes bancarios', 'Crítico', 'David Morales', 'Servicio Cliente', ARRAY['CRM Bancario', 'Canales Digitales'], 'David Morales', 'Ana Martinez', 'Operaciones', 'Gerencia'),
('22222222-2222-2222-2222-222222222222', 'Cumplimiento Regulatorio', 'Gestión de compliance y reportes regulatorios', 'Crítico', 'Elena Ruiz', 'Compliance', ARRAY['Sistemas Regulatorios', 'Auditoría'], 'Elena Ruiz', 'Ana Martinez', 'Legal', 'Junta Directiva'),
('22222222-2222-2222-2222-222222222222', 'Ciberseguridad Financiera', 'Protección de activos digitales y datos', 'Crítico', 'Fernando Castro', 'Seguridad', ARRAY['SOC', 'Herramientas de Seguridad'], 'Fernando Castro', 'Ana Martinez', 'IT', 'Todas las áreas');