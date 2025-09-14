-- NOTE: Los usuarios deben ser creados manualmente en Supabase Auth
-- Esta migración prepara los datos para cuando se creen los usuarios

-- Crear los datos de prueba completos una vez que los usuarios estén registrados
-- Los usuarios pueden usar estas credenciales para registrarse:

-- Usuario1: usuario1@empresa1.com / TestPass123!
-- Usuario2: usuario2@empresa2.com / TestPass123!

-- Esta migration creará un trigger para auto-popular datos cuando se registren usuarios con estos emails específicos

CREATE OR REPLACE FUNCTION public.setup_demo_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo aplicar para los usuarios demo específicos
  IF NEW.email IN ('usuario1@empresa1.com', 'usuario2@empresa2.com') THEN
    
    -- Crear perfil para el usuario
    IF NEW.email = 'usuario1@empresa1.com' THEN
      INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position) 
      VALUES (NEW.id, 'Carlos Rodriguez', 'Empresa1 - Tecnología Avanzada S.A.', NEW.email, '+34-600-111-111', 'Director de Continuidad');
      
      -- Procesos críticos Empresa1
      INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
      (gen_random_uuid(), NEW.id, 'Desarrollo de Software', 'Proceso principal de desarrollo y mantenimiento de aplicaciones', 'Crítico', 'Juan Pérez', 'IT', ARRAY['Infraestructura TI', 'Gestión de Proyectos'], 'Juan Pérez', 'Carlos Rodriguez', 'Equipo QA', 'Gerencia General'),
      (gen_random_uuid(), NEW.id, 'Soporte Técnico al Cliente', 'Atención y resolución de incidencias técnicas', 'Crítico', 'Maria González', 'Soporte', ARRAY['Sistema CRM', 'Base de Conocimientos'], 'Maria González', 'Carlos Rodriguez', 'Desarrollo', 'Ventas'),
      (gen_random_uuid(), NEW.id, 'Gestión de Infraestructura TI', 'Mantenimiento y operación de servidores y redes', 'Crítico', 'Pedro Sánchez', 'IT', ARRAY['Proveedores Cloud', 'Seguridad'], 'Pedro Sánchez', 'Carlos Rodriguez', 'Desarrollo', 'Todas las áreas'),
      (gen_random_uuid(), NEW.id, 'Facturación y Cobranza', 'Emisión de facturas y gestión de cobros', 'Crítico', 'Lucia Torres', 'Finanzas', ARRAY['Sistema ERP', 'Bancos'], 'Lucia Torres', 'Carlos Rodriguez', 'Ventas', 'Gerencia'),
      (gen_random_uuid(), NEW.id, 'Gestión Comercial', 'Ventas y relación con clientes', 'Crítico', 'Roberto Vila', 'Ventas', ARRAY['CRM', 'Marketing'], 'Roberto Vila', 'Carlos Rodriguez', 'Marketing', 'Gerencia');
      
    ELSIF NEW.email = 'usuario2@empresa2.com' THEN
      INSERT INTO public.profiles (user_id, full_name, company_name, email, phone, position)
      VALUES (NEW.id, 'Ana Martinez', 'Empresa2 - Servicios Financieros Ltda.', NEW.email, '+34-600-222-222', 'Gerente de Riesgos');
      
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;