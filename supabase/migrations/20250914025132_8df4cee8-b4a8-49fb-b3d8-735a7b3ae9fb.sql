-- Clean all user data tables (preserve system tables like user_roles, user_subscriptions)
DELETE FROM process_strategy_evaluations;
DELETE FROM test_execution_steps;
DELETE FROM corrective_actions;
DELETE FROM continuity_tests;
DELETE FROM continuity_plans;
DELETE FROM continuity_strategies;
DELETE FROM bia_assessments;
DELETE FROM risk_analysis;
DELETE FROM business_processes;
DELETE FROM strategy_criteria;
DELETE FROM compliance_requirements;
DELETE FROM compliance_framework;
DELETE FROM kpi_metrics;
DELETE FROM maintenance_activities;
DELETE FROM management_reviews;
DELETE FROM findings;
DELETE FROM profiles;

-- Insert test user profiles (these will be the companies)
INSERT INTO profiles (user_id, full_name, company_name, email, phone, position) VALUES
-- Usuario1 - Empresa1
('11111111-1111-1111-1111-111111111111', 'Carlos Rodriguez', 'Empresa1 - Tecnología Avanzada S.A.', 'usuario1@empresa1.com', '+34-600-111-111', 'Director de Continuidad'),
-- Usuario2 - Empresa2  
('22222222-2222-2222-2222-222222222222', 'Ana Martinez', 'Empresa2 - Servicios Financieros Ltda.', 'usuario2@empresa2.com', '+34-600-222-222', 'Gerente de Riesgos');

-- Insert business processes for Empresa1 (Usuario1)
INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
('bp1-emp1-001', '11111111-1111-1111-1111-111111111111', 'Desarrollo de Software', 'Proceso principal de desarrollo y mantenimiento de aplicaciones', 'Crítico', 'Juan Pérez', 'IT', ARRAY['Infraestructura TI', 'Gestión de Proyectos'], 'Juan Pérez', 'Carlos Rodriguez', 'Equipo QA', 'Gerencia General'),
('bp1-emp1-002', '11111111-1111-1111-1111-111111111111', 'Soporte Técnico al Cliente', 'Atención y resolución de incidencias técnicas', 'Crítico', 'Maria González', 'Soporte', ARRAY['Sistema CRM', 'Base de Conocimientos'], 'Maria González', 'Carlos Rodriguez', 'Desarrollo', 'Ventas'),
('bp1-emp1-003', '11111111-1111-1111-1111-111111111111', 'Gestión de Infraestructura TI', 'Mantenimiento y operación de servidores y redes', 'Crítico', 'Pedro Sánchez', 'IT', ARRAY['Proveedores Cloud', 'Seguridad'], 'Pedro Sánchez', 'Carlos Rodriguez', 'Desarrollo', 'Todas las áreas'),
('bp1-emp1-004', '11111111-1111-1111-1111-111111111111', 'Facturación y Cobranza', 'Emisión de facturas y gestión de cobros', 'Crítico', 'Lucia Torres', 'Finanzas', ARRAY['Sistema ERP', 'Bancos'], 'Lucia Torres', 'Carlos Rodriguez', 'Ventas', 'Gerencia'),
('bp1-emp1-005', '11111111-1111-1111-1111-111111111111', 'Gestión Comercial', 'Ventas y relación con clientes', 'Crítico', 'Roberto Vila', 'Ventas', ARRAY['CRM', 'Marketing'], 'Roberto Vila', 'Carlos Rodriguez', 'Marketing', 'Gerencia');

-- Insert business processes for Empresa2 (Usuario2)
INSERT INTO business_processes (id, user_id, name, description, criticality_level, responsible_person, department, dependencies, raci_responsible, raci_accountable, raci_consulted, raci_informed) VALUES
('bp2-emp2-001', '22222222-2222-2222-2222-222222222222', 'Procesamiento de Transacciones', 'Procesamiento en tiempo real de operaciones financieras', 'Crítico', 'Miguel Herrera', 'Operaciones', ARRAY['Core Bancario', 'Redes de Pago'], 'Miguel Herrera', 'Ana Martinez', 'Riesgos', 'Regulador'),
('bp2-emp2-002', '22222222-2222-2222-2222-222222222222', 'Gestión de Riesgo Crediticio', 'Evaluación y seguimiento de riesgos de crédito', 'Crítico', 'Carmen López', 'Riesgos', ARRAY['Centrales de Riesgo', 'Sistema Scoring'], 'Carmen López', 'Ana Martinez', 'Auditoría', 'Comité de Riesgos'),
('bp2-emp2-003', '22222222-2222-2222-2222-222222222222', 'Atención al Cliente Bancario', 'Servicio integral a clientes bancarios', 'Crítico', 'David Morales', 'Servicio Cliente', ARRAY['CRM Bancario', 'Canales Digitales'], 'David Morales', 'Ana Martinez', 'Operaciones', 'Gerencia'),
('bp2-emp2-004', '22222222-2222-2222-2222-222222222222', 'Cumplimiento Regulatorio', 'Gestión de compliance y reportes regulatorios', 'Crítico', 'Elena Ruiz', 'Compliance', ARRAY['Sistemas Regulatorios', 'Auditoría'], 'Elena Ruiz', 'Ana Martinez', 'Legal', 'Junta Directiva'),
('bp2-emp2-005', '22222222-2222-2222-2222-222222222222', 'Ciberseguridad Financiera', 'Protección de activos digitales y datos', 'Crítico', 'Fernando Castro', 'Seguridad', ARRAY['SOC', 'Herramientas de Seguridad'], 'Fernando Castro', 'Ana Martinez', 'IT', 'Todas las áreas');

-- Insert risk analysis for both companies (10 risks total - 5 each)
INSERT INTO risk_analysis (id, user_id, risk_name, risk_description, category, probability, impact, risk_level, mitigation_strategy, contingency_plan, process_id) VALUES
-- Riesgos Empresa1
('risk-emp1-001', '11111111-1111-1111-1111-111111111111', 'Falla del Servidor Principal', 'Caída completa del servidor de aplicaciones principal', 'Tecnológico', 4, 5, 20, 'Implementar servidor de respaldo automático con sincronización', 'Activar servidor secundario en 15 minutos', 'bp1-emp1-001'),
('risk-emp1-002', '11111111-1111-1111-1111-111111111111', 'Pérdida de Personal Clave', 'Renuncia o incapacidad del desarrollador líder', 'Recursos Humanos', 3, 4, 12, 'Documentar procesos y entrenar personal de respaldo', 'Contratar consultor externo temporal', 'bp1-emp1-001'),
('risk-emp1-003', '11111111-1111-1111-1111-111111111111', 'Corte de Internet', 'Interrupción del servicio de conectividad', 'Infraestructura', 3, 4, 12, 'Contratar proveedor de internet secundario', 'Usar conexión de respaldo 4G/5G', 'bp1-emp1-003'),
('risk-emp1-004', '11111111-1111-1111-1111-111111111111', 'Cyberattaque Ransomware', 'Ataque que cifra archivos críticos del sistema', 'Seguridad', 2, 5, 10, 'Implementar backup automático y antivirus avanzado', 'Restaurar desde backup offline', 'bp1-emp1-003'),
('risk-emp1-005', '11111111-1111-1111-1111-111111111111', 'Error en Facturación Masiva', 'Fallo que genera facturas incorrectas a clientes', 'Operacional', 2, 4, 8, 'Implementar validaciones automáticas pre-envío', 'Proceso manual de facturación de emergencia', 'bp1-emp1-004'),

-- Riesgos Empresa2
('risk-emp2-001', '22222222-2222-2222-2222-222222222222', 'Falla del Core Bancario', 'Interrupción del sistema central de transacciones', 'Tecnológico', 2, 5, 10, 'Mantener core de respaldo sincronizado', 'Activar core secundario en máximo 30 minutos', 'bp2-emp2-001'),
('risk-emp2-002', '22222222-2222-2222-2222-222222222222', 'Fraude Masivo en Tarjetas', 'Compromiso de datos de tarjetas de múltiples clientes', 'Seguridad', 3, 5, 15, 'Monitoreo 24/7 y tokenización de datos', 'Bloqueo inmediato y emisión de nuevas tarjetas', 'bp2-emp2-001'),
('risk-emp2-003', '22222222-2222-2222-2222-222222222222', 'Incumplimiento Regulatorio', 'Falla en reporte a autoridades supervisoras', 'Regulatorio', 2, 4, 8, 'Automatizar generación y validación de reportes', 'Reporte manual de emergencia en 24h', 'bp2-emp2-004'),
('risk-emp2-004', '22222222-2222-2222-2222-222222222222', 'Ataque DDoS', 'Saturación de servicios digitales del banco', 'Tecnológico', 4, 3, 12, 'Contratar servicio anti-DDoS profesional', 'Redirigir tráfico a infraestructura de respaldo', 'bp2-emp2-005'),
('risk-emp2-005', '22222222-2222-2222-2222-222222222222', 'Falla en Central de Riesgos', 'Interrupción en consulta de centrales externas', 'Operacional', 3, 3, 9, 'Integrar múltiples centrales de riesgo', 'Evaluación manual temporal con criterios estrictos', 'bp2-emp2-002');

-- Insert strategy criteria for both companies
INSERT INTO strategy_criteria (id, user_id, criteria_name, description, criteria_type, weight, min_value, max_value, module_type) VALUES
-- Criterios Empresa1
('crit-emp1-001', '11111111-1111-1111-1111-111111111111', 'Tiempo de Implementación', 'Tiempo requerido para implementar la estrategia (en días)', 'quantitative', 0.25, 1, 30, 'strategy'),
('crit-emp1-002', '11111111-1111-1111-1111-111111111111', 'Costo de Implementación', 'Inversión requerida para la estrategia (miles €)', 'quantitative', 0.30, 1, 100, 'strategy'),
('crit-emp1-003', '11111111-1111-1111-1111-111111111111', 'Nivel de Automatización', 'Grado de automatización de la solución', 'qualitative', 0.20, 1, 5, 'strategy'),
('crit-emp1-004', '11111111-1111-1111-1111-111111111111', 'Facilidad de Mantenimiento', 'Simplicidad para mantener la solución', 'qualitative', 0.25, 1, 5, 'strategy'),

-- Criterios Empresa2
('crit-emp2-001', '22222222-2222-2222-2222-222222222222', 'Cumplimiento Regulatorio', 'Nivel de cumplimiento con normativas bancarias', 'qualitative', 0.35, 1, 5, 'strategy'),
('crit-emp2-002', '22222222-2222-2222-2222-222222222222', 'Tiempo de Recuperación', 'RTO - Tiempo para restaurar operaciones (minutos)', 'quantitative', 0.30, 5, 120, 'strategy'),
('crit-emp2-003', '22222222-2222-2222-2222-222222222222', 'Inversión Requerida', 'Capital necesario para implementar (miles €)', 'quantitative', 0.20, 10, 500, 'strategy'),
('crit-emp2-004', '22222222-2222-2222-2222-222222222222', 'Nivel de Seguridad', 'Robustez de seguridad de la solución', 'qualitative', 0.15, 1, 5, 'strategy');

-- Insert continuity strategies for both companies
INSERT INTO continuity_strategies (id, user_id, name, description, strategy_type, estimated_cost, implementation_timeline, resources_required, applicable_risks, process_id) VALUES
-- Estrategias Empresa1
('strat-emp1-001', '11111111-1111-1111-1111-111111111111', 'Servidor de Respaldo Hot-Standby', 'Servidor secundario sincronizado en tiempo real', 'Tecnológica', 25000, 15, 'Hardware, Software, Configuración', ARRAY['Falla de servidor', 'Pérdida de datos'], 'bp1-emp1-001'),
('strat-emp1-002', '11111111-1111-1111-1111-111111111111', 'Trabajo Remoto Distribuido', 'Capacidad de trabajo desde ubicaciones alternativas', 'Organizacional', 10000, 10, 'VPN, Equipos portátiles, Comunicaciones', ARRAY['Desastre en oficina', 'Pandemia'], 'bp1-emp1-002'),
('strat-emp1-003', '11111111-1111-1111-1111-111111111111', 'Facturación en la Nube', 'Migrar sistema de facturación a cloud', 'Tecnológica', 35000, 25, 'Migración, Capacitación, Integración', ARRAY['Falla de sistema', 'Desastre local'], 'bp1-emp1-004'),

-- Estrategias Empresa2
('strat-emp2-001', '22222222-2222-2222-2222-222222222222', 'Core Bancario Duplicado', 'Sistema core espejo en datacenter alterno', 'Tecnológica', 200000, 45, 'Hardware bancario, Licencias, Integración', ARRAY['Falla core principal', 'Desastre datacenter'], 'bp2-emp2-001'),
('strat-emp2-002', '22222222-2222-2222-2222-222222222222', 'Centro de Operaciones Alterno', 'Sede secundaria completamente operativa', 'Infraestructura', 150000, 60, 'Oficina, Equipos, Personal', ARRAY['Desastre sede principal', 'Incendio'], 'bp2-emp2-002'),
('strat-emp2-003', '22222222-2222-2222-2222-222222222222', 'Outsourcing de Servicios Críticos', 'Tercerización de operaciones no core', 'Organizacional', 80000, 30, 'Contrato proveedor, Transición', ARRAY['Pérdida personal', 'Falla operativa'], 'bp2-emp2-003');

-- Insert BIA assessments for critical processes
INSERT INTO bia_assessments (id, user_id, process_id, rto, rpo, mtpd, mbco, financial_impact_1h, financial_impact_24h, financial_impact_1w, operational_impact, regulatory_impact, reputation_impact) VALUES
-- BIA Empresa1
('bia-emp1-001', '11111111-1111-1111-1111-111111111111', 'bp1-emp1-001', 4, 1, 8, 24, 5000, 25000, 100000, 'Paralización total del desarrollo', 'Incumplimiento de contratos', 'Pérdida de confianza de clientes'),
('bia-emp1-002', '11111111-1111-1111-1111-111111111111', 'bp1-emp1-002', 2, 0, 4, 12, 2000, 15000, 75000, 'Acumulación de tickets sin resolver', 'No aplica', 'Insatisfacción del cliente'),
('bia-emp1-003', '11111111-1111-1111-1111-111111111111', 'bp1-emp1-003', 1, 0, 2, 8, 8000, 40000, 200000, 'Sistemas inaccesibles', 'No aplica', 'Imagen tecnológica deteriorada'),
('bia-emp1-004', '11111111-1111-1111-1111-111111111111', 'bp1-emp1-004', 6, 2, 12, 48, 3000, 20000, 90000, 'Facturas no emitidas', 'Problemas fiscales', 'Desconfianza comercial'),
('bia-emp1-005', '11111111-1111-1111-1111-111111111111', 'bp1-emp1-005', 3, 1, 6, 24, 4000, 30000, 150000, 'Ventas suspendidas', 'No aplica', 'Pérdida de market share'),

-- BIA Empresa2
('bia-emp2-001', '22222222-2222-2222-2222-222222222222', 'bp2-emp2-001', 0.5, 0, 1, 4, 50000, 500000, 2000000, 'Transacciones bloqueadas completamente', 'Incumplimiento severo normativo', 'Crisis de confianza masiva'),
('bia-emp2-002', '22222222-2222-2222-2222-222222222222', 'bp2-emp2-002', 2, 0, 4, 24, 20000, 200000, 800000, 'Evaluación de riesgo manual', 'Reportes regulatorios afectados', 'Pérdida de credibilidad crediticia'),
('bia-emp2-003', '22222222-2222-2222-2222-222222222222', 'bp2-emp2-003', 1, 0, 2, 12, 15000, 100000, 400000, 'Clientes sin atención', 'Quejas regulatorias', 'Fuga masiva de clientes'),
('bia-emp2-004', '22222222-2222-2222-2222-222222222222', 'bp2-emp2-004', 4, 1, 8, 48, 10000, 80000, 300000, 'Reportes no enviados', 'Sanciones regulatorias graves', 'Pérdida de licencia bancaria'),
('bia-emp2-005', '22222222-2222-2222-2222-222222222222', 'bp2-emp2-005', 0.25, 0, 0.5, 2, 30000, 250000, 1000000, 'Vulnerabilidad total de sistemas', 'Incumplimiento de seguridad', 'Pérdida total de confianza');

-- Insert continuity plans
INSERT INTO continuity_plans (id, user_id, plan_name, plan_type, description, scope, objectives, activation_criteria, key_personnel, communication_plan, testing_schedule, version, status, procedures, resources) VALUES
-- Planes Empresa1
('plan-emp1-001', '11111111-1111-1111-1111-111111111111', 'Plan de Continuidad TI', 'Tecnológico', 'Plan integral para mantener operaciones TI críticas', 'Sistemas de desarrollo, infraestructura y soporte', ARRAY['Garantizar RTO < 4h', 'Mantener RPO < 1h', 'Comunicación efectiva'], 'Falla de servidor principal, caída de red, pérdida de personal TI clave', ARRAY['Carlos Rodriguez - Director', 'Juan Pérez - Líder Desarrollo', 'Pedro Sánchez - Infraestructura'], 'Cadena telefónica, email masivo, WhatsApp grupos', 'Trimestral - simulacros, Anual - plan completo', '2.1', 'Activo', '{"activacion": "Evaluación inicial en 15 min", "comunicacion": "Notificar equipos en 30 min", "recuperacion": "Activar sistemas backup en 1h"}', '{"tecnicos": "Servidores backup, UPS, generador", "humanos": "Equipo oncall 24/7", "financieros": "Presupuesto emergencia 50k€"}'),

('plan-emp1-002', '11111111-1111-1111-1111-111111111111', 'Plan de Continuidad Comercial', 'Comercial', 'Mantenimiento de operaciones de ventas y facturación', 'Ventas, facturación, atención cliente', ARRAY['Mantener ingresos > 80%', 'Tiempo resolución < 6h', 'Satisfacción cliente > 85%'], 'Falla sistemas comerciales, pérdida personal ventas', ARRAY['Carlos Rodriguez - Director', 'Roberto Vila - Ventas', 'Lucia Torres - Finanzas'], 'CRM, email, teléfono directo clientes', 'Mensual - procedimientos, Semestral - simulacro completo', '1.8', 'Activo', '{"ventas": "Proceso manual con formularios", "facturacion": "Sistema backup en 2h", "clientes": "Comunicación proactiva"}', '{"sistemas": "CRM backup, formularios físicos", "comunicacion": "Teléfonos satelitales", "personal": "Equipo backup capacitado"}'),

-- Planes Empresa2
('plan-emp2-001', '22222222-2222-2222-2222-222222222222', 'Plan de Continuidad Core Bancario', 'Crítico', 'Continuidad operacional del core bancario y transacciones', 'Transacciones, ATMs, banca digital, tarjetas', ARRAY['RTO < 30 min', 'RPO = 0', 'Disponibilidad 99.9%', 'Cumplimiento regulatorio 100%'], 'Falla core principal, desastre datacenter, cyberattaque', ARRAY['Ana Martinez - Gerente Riesgos', 'Miguel Herrera - Operaciones', 'Fernando Castro - Seguridad'], 'Protocolo crisis: SMS, llamadas, sala crisis', 'Mensual - componentes, Trimestral - plan completo', '3.2', 'Activo', '{"core_backup": "Activación automática en 15 min", "validacion": "Verificación integridad en 5 min", "comunicacion": "Notificación automática stakeholders"}', '{"datacenter": "Sitio secundario sincronizado", "conectividad": "Enlaces redundantes", "personal": "Equipo 24/7 especializado"}'),

('plan-emp2-002', '22222222-2222-2222-2222-222222222222', 'Plan de Continuidad Regulatorio', 'Compliance', 'Mantenimiento del cumplimiento normativo en crisis', 'Reportes regulatorios, auditorías, compliance', ARRAY['Reportes regulatorios 100% a tiempo', 'Comunicación con supervisor < 2h', 'Documentación completa'], 'Falla sistemas regulatorios, pérdida personal compliance', ARRAY['Ana Martinez - Gerente Riesgos', 'Elena Ruiz - Compliance', 'Carmen López - Riesgo Crediticio'], 'Línea directa con supervisor, email cifrado', 'Quincenal - reportes, Mensual - procedimientos', '2.5', 'Activo', '{"reportes_manuales": "Procedimiento backup en 4h", "comunicacion_supervisor": "Protocolo directo", "documentacion": "Repository seguro offline"}', '{"sistemas": "Plataforma backup reportes", "comunicacion": "Canales seguros redundantes", "documentacion": "Backup cifrado offsite"}');

-- Insert continuity tests
INSERT INTO continuity_tests (id, user_id, plan_id, test_name, test_type, test_date, participants, objectives, results, findings, overall_rating) VALUES
-- Pruebas Empresa1
('test-emp1-001', '11111111-1111-1111-1111-111111111111', 'plan-emp1-001', 'Simulacro Falla Servidor Principal', 'Simulacro Técnico', '2024-01-15', ARRAY['Carlos Rodriguez', 'Juan Pérez', 'Pedro Sánchez', 'Equipo Desarrollo'], ARRAY['Verificar RTO < 4h', 'Probar backup automático', 'Validar comunicaciones'], 'RTO alcanzado: 2.5h. Backup activado correctamente. Comunicación efectiva.', ARRAY['Backup automático funcionó perfectamente', 'Tiempo de comunicación inicial fue de 10 min', 'Un desarrollador no recibió notificación'], 4),

('test-emp1-002', '11111111-1111-1111-1111-111111111111', 'plan-emp1-002', 'Prueba de Facturación Manual', 'Mesa de Trabajo', '2024-02-20', ARRAY['Carlos Rodriguez', 'Lucia Torres', 'Roberto Vila', 'Equipo Finanzas'], ARRAY['Procesar facturas manualmente', 'Verificar tiempo de proceso', 'Validar exactitud'], 'Proceso manual completado en 4h. Precisión del 98%. Algunos errores menores.', ARRAY['Personal bien capacitado en proceso manual', 'Formularios físicos disponibles', 'Necesario mejorar validación manual'], 3),

-- Pruebas Empresa2
('test-emp2-001', '22222222-2222-2222-2222-222222222222', 'plan-emp2-001', 'Failover Core Bancario', 'Simulacro Real', '2024-01-10', ARRAY['Ana Martinez', 'Miguel Herrera', 'Fernando Castro', 'Equipo NOC'], ARRAY['RTO < 30 min', 'Verificar integridad datos', 'Probar notificaciones'], 'Failover completado en 18 min. Integridad 100%. Notificaciones automáticas funcionaron.', ARRAY['Core secundario activado automáticamente', 'Sincronización de datos perfecta', 'Notificaciones llegaron a todos los stakeholders'], 5),

('test-emp2-002', '22222222-2222-2222-2222-222222222222', 'plan-emp2-002', 'Reporte Regulatorio de Emergencia', 'Mesa de Trabajo', '2024-02-28', ARRAY['Ana Martinez', 'Elena Ruiz', 'Carmen López'], ARRAY['Generar reporte manual', 'Comunicar a supervisor', 'Documentar proceso'], 'Reporte generado en 3h. Supervisor notificado en 1h. Documentación completa.', ARRAY['Proceso manual bien documentado', 'Comunicación con supervisor efectiva', 'Tiempo de generación aceptable'], 4);

-- Insert test execution steps
INSERT INTO test_execution_steps (id, test_id, user_id, step_number, step_description, expected_result, actual_result, status, execution_time, executed_by, notes) VALUES
-- Steps para test-emp1-001
('step-emp1-001-1', 'test-emp1-001', '11111111-1111-1111-1111-111111111111', 1, 'Simular falla del servidor principal', 'Detección automática de falla en 2 min', 'Falla detectada en 1.5 min', 'Exitoso', 2, 'Pedro Sánchez', 'Detección más rápida de lo esperado'),
('step-emp1-001-2', 'test-emp1-001', '11111111-1111-1111-1111-111111111111', 2, 'Activar servidor de backup', 'Activación automática en 5 min', 'Activación en 4 min', 'Exitoso', 4, 'Pedro Sánchez', 'Proceso automático funcionó perfectamente'),
('step-emp1-001-3', 'test-emp1-001', '11111111-1111-1111-1111-111111111111', 3, 'Notificar al equipo de desarrollo', 'Notificación en 10 min', 'Notificación parcial en 10 min', 'Parcial', 15, 'Juan Pérez', 'Un desarrollador no recibió la notificación'),
('step-emp1-001-4', 'test-emp1-001', '11111111-1111-1111-1111-111111111111', 4, 'Verificar funcionamiento completo', 'Sistema operativo en 30 min', 'Sistema operativo en 25 min', 'Exitoso', 25, 'Equipo Desarrollo', 'Todas las funcionalidades verificadas'),

-- Steps para test-emp2-001
('step-emp2-001-1', 'test-emp2-001', '22222222-2222-2222-2222-222222222222', 1, 'Initiar failover del core bancario', 'Activación automática en 15 min', 'Activación en 12 min', 'Exitoso', 12, 'Miguel Herrera', 'Failover más rápido que especificación'),
('step-emp2-001-2', 'test-emp2-001', '22222222-2222-2222-2222-222222222222', 2, 'Verificar integridad de transacciones', 'Integridad 100% de datos', 'Integridad 100% verificada', 'Exitoso', 8, 'Equipo NOC', 'Todas las transacciones íntegras'),
('step-emp2-001-3', 'test-emp2-001', '22222222-2222-2222-2222-222222222222', 3, 'Probar transacciones en core secundario', 'Transacciones funcionando normalmente', 'Transacciones operativas', 'Exitoso', 5, 'Miguel Herrera', 'Rendimiento normal del sistema'),
('step-emp2-001-4', 'test-emp2-001', '22222222-2222-2222-2222-222222222222', 4, 'Notificar stakeholders automáticamente', 'Notificaciones enviadas en 2 min', 'Notificaciones enviadas en 1 min', 'Exitoso', 1, 'Sistema Automático', 'Notificaciones más rápidas que lo esperado');

-- Insert corrective actions
INSERT INTO corrective_actions (id, test_id, user_id, action_description, assigned_to, assigned_email, priority, status, due_date, progress_notes) VALUES
-- Acciones correctivas Empresa1
('ca-emp1-001', 'test-emp1-001', '11111111-1111-1111-1111-111111111111', 'Mejorar sistema de notificaciones para incluir canal de respaldo', 'Juan Pérez', 'juan.perez@empresa1.com', 'Alta', 'En Progreso', '2024-03-15', 'Evaluando opciones de SMS como respaldo'),
('ca-emp1-002', 'test-emp1-002', '11111111-1111-1111-1111-111111111111', 'Desarrollar checklist de validación para proceso manual de facturación', 'Lucia Torres', 'lucia.torres@empresa1.com', 'Media', 'Pendiente', '2024-04-01', 'Pendiente de inicio'),

-- Acciones correctivas Empresa2
('ca-emp2-001', 'test-emp2-002', '22222222-2222-2222-2222-222222222222', 'Optimizar tiempo de generación de reportes manuales', 'Elena Ruiz', 'elena.ruiz@empresa2.com', 'Media', 'Completado', '2024-03-20', 'Implementadas mejoras en templates. Tiempo reducido a 2h.'),
('ca-emp2-002', 'test-emp2-001', '22222222-2222-2222-2222-222222222222', 'Documentar procedimiento de rollback del core bancario', 'Miguel Herrera', 'miguel.herrera@empresa2.com', 'Alta', 'En Progreso', '2024-03-30', 'Procedimiento 70% completado. Falta testing.');

-- Insert management reviews
INSERT INTO management_reviews (id, user_id, review_date, review_period_start, review_period_end, attendees, system_effectiveness_rating, objectives_achievement_percentage, incidents_count, tests_conducted, corrective_actions_closed, review_status, strengths, improvement_areas, strategic_decisions, resource_requirements, policy_changes, objective_updates) VALUES
-- Reviews Empresa1
('review-emp1-001', '11111111-1111-1111-1111-111111111111', '2024-03-31', '2024-01-01', '2024-03-31', '{"director": "Carlos Rodriguez", "it_lead": "Juan Pérez", "operations": "Pedro Sánchez", "finance": "Lucia Torres"}', 4.2, 85, 2, 5, 3, 'Completado', 'Sistemas de backup funcionando excelentemente. Equipo bien capacitado. Comunicación efectiva.', 'Mejorar tiempo de notificaciones. Fortalecer procesos manuales. Aumentar frecuencia de pruebas.', 'Inversión en sistema de notificaciones redundante. Capacitación adicional en procesos manuales.', 'Presupuesto adicional 15k€ para mejoras en comunicaciones', 'Actualizar política de notificaciones de emergencia', 'Reducir RTO objetivo a 3h para desarrollo'),

-- Reviews Empresa2
('review-emp2-001', '22222222-2222-2222-2222-222222222222', '2024-03-31', '2024-01-01', '2024-03-31', '{"risk_manager": "Ana Martinez", "operations": "Miguel Herrera", "security": "Fernando Castro", "compliance": "Elena Ruiz"}', 4.8, 95, 1, 4, 2, 'Completado', 'Core bancario extremadamente robusto. Cumplimiento regulatorio excelente. Equipo altamente capacitado.', 'Optimizar tiempos de reporte manual. Documentar mejor procedimientos de rollback.', 'Implementar mejoras en generación de reportes. Completar documentación de rollback.', 'Asignación de 2 recursos adicionales para compliance', 'Actualizar procedimientos de comunicación con supervisor', 'Reducir RTO objetivo del core a 20 minutos');

-- Insert KPI metrics for monitoring
INSERT INTO kpi_metrics (id, user_id, metric_name, metric_type, measurement_unit, measurement_period, target_value, current_value, trend, status, responsible_person, notes) VALUES
-- KPIs Empresa1
('kpi-emp1-001', '11111111-1111-1111-1111-111111111111', 'RTO Promedio Sistemas TI', 'Tiempo', 'horas', 'Mensual', 4, 2.5, 'Mejorando', 'Superando objetivo', 'Pedro Sánchez', 'Consistentemente por debajo del objetivo'),
('kpi-emp1-002', '11111111-1111-1111-1111-111111111111', 'Disponibilidad Sistemas Críticos', 'Porcentaje', '%', 'Mensual', 99.5, 99.8, 'Estable', 'Superando objetivo', 'Juan Pérez', 'Excelente rendimiento'),
('kpi-emp1-003', '11111111-1111-1111-1111-111111111111', 'Tiempo de Notificación Emergencias', 'Tiempo', 'minutos', 'Por evento', 10, 12, 'Estable', 'Cerca del objetivo', 'Carlos Rodriguez', 'Necesita mejora tras último test'),

-- KPIs Empresa2
('kpi-emp2-001', '22222222-2222-2222-2222-222222222222', 'RTO Core Bancario', 'Tiempo', 'minutos', 'Por evento', 30, 18, 'Mejorando', 'Superando objetivo', 'Miguel Herrera', 'Consistentemente mejor que objetivo'),
('kpi-emp2-002', '22222222-2222-2222-2222-222222222222', 'Cumplimiento Reportes Regulatorios', 'Porcentaje', '%', 'Mensual', 100, 100, 'Estable', 'En objetivo', 'Elena Ruiz', 'Perfecto cumplimiento'),
('kpi-emp2-003', '22222222-2222-2222-2222-222222222222', 'Tiempo Generación Reportes Manuales', 'Tiempo', 'horas', 'Por evento', 4, 2, 'Mejorando', 'Superando objetivo', 'Elena Ruiz', 'Mejoras implementadas funcionando');