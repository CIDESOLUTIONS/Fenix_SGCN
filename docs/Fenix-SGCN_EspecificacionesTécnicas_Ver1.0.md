
Especificaciones Técnicas y Funcionales — Fenix-SGCN v1.0

**Proyecto:** Fenix-SGCN — Plataforma SaaS para Sistemas de Gestión de Continuidad del Negocio (SGCN)  
**Versión:** 1.0 — Fecha: 2025-09-17  
**Autor:** CIDE Solutions/ Equipo de Producto
**Empresa:** CIDE SAS
**Ubicación:** Bogotá - Colombia
**Teléfono:** +57 3157651063 
** Plaeta de colores azul indigo y verde esmeralda

---

## 1. Objetivo y Alcance
Construir la plataforma SaaS más completa del mercado para la gestión de continuidad de negocio y riesgos, superando las funcionalidades de soluciones líderes (Fusion, Veoci, MetricStream). 
La plataforma permitirá a las organizaciones **implementar, operar, auditar y mejorar** su SGCN con total conformidad a **ISO-22301 y otros, ISO-31000, NIST, FFIEC y GDPR**, soportando además prácticas avanzadas de automatización, trazabilidad inmutable y análisis predictivo.

---

## 2. Requerimientos funcionales

### 2.1 Portal Público / Comercial
- Landing + SEO avanzado con contenido sectorial.  
- Demo interactiva gamificada (mini-BIA y simulación de incidente).  
- Catálogo de plantillas de cumplimiento (ISO, NIST, GDPR).  
- Marketplace de add-ons (integraciones externas, módulos premium).  

### 2.2 Portal Admin (empresa)

**Dashboard ejecutivo**  
- KPIs de resiliencia: cumplimiento de RTO/RPO, estado de riesgos, madurez del SGCN.  
- Heatmaps dinámicos (procesos críticos, dependencias, SLA proveedores).  
- AI Advisor: recomendaciones predictivas (procesos en riesgo, gaps en planes).  

**Bitácora de incidentes**  
- Registro central con orquestación multi-canal (SMS, WhatsApp, Teams, Slack).  
- Timeline exportable con sellos de tiempo y firma digital.  
- Capacidad de simulación de crisis en “sandbox” para entrenamiento.  

Menú lateral colapsable, con los siguientes módulos de funcionalidades:

#### 2.2.1 Planeación y Gobierno
- Gestión de políticas con workflow de aprobación, firmas electrónicas y control de vigencia.  
- RACI editor colaborativo con versionado y auditoría.  
- Biblioteca de documentos con control legal-hold, etiquetado automático con IA y búsqueda semántica.  

#### 2.2.2 Riesgo de Continuidad (ARA)
- Registro de riesgos con métricas avanzadas (KRIs, KPIs).  
- Integración con fuentes externas (amenazas climáticas, ciberseguridad).  
- Escenarios “what-if” con simulaciones Montecarlo.  
- Score global de resiliencia por proceso y por unidad de negocio.  

#### 2.2.3 Análisis de Impacto al Negocio (BIA)
- Cuestionarios inteligentes con sugerencias automáticas de RTO/RPO/MTPD/MBCO.  
- Simulación de interrupciones con cálculo de pérdidas económicas.  
- Dependency Mapping visual (procesos, sistemas, proveedores).  
- Export de informes con gráficos interactivos (web/PDF).  

#### 2.2.4 Escenarios y Estrategias
- Biblioteca de escenarios sectoriales precargados (banca, energía, salud).  
- Algoritmo de recomendación de estrategias según costo vs impacto.  
- Simulación de estrategias con métricas de costo-efectividad.  

#### 2.2.5 Planes de Continuidad (BCP/DRP/IRP)
- Editor visual de planes (drag & drop, bloques reutilizables).  
- Orquestador en vivo: activar plan, asignar tareas, seguimiento de ejecución.  
- Playbooks integrados con ITSM (ServiceNow, Jira) y notificaciones automáticas.  
- Registro de tiempos reales de respuesta para comparación con RTO/RPO.
- Plan de Gestón de Crisis (  

#### 2.2.6 Pruebas de Continuidad
- Programador avanzado de ejercicios (con auditorías internas/externas).  
- Tipos: simulacro, escritorio, estrés, full recovery.  
- Ejecución guiada con checklist dinámico y scoring automático.  
- Captura de evidencias multimedia (video, audio, logs).  
- Comparador de resultados por iteración (madurez de pruebas).  

#### 2.2.7 Mantenimiento y Mejora Continua
- Registro de hallazgos, no conformidades y acciones correctivas.  
- Workflow automatizado para ciclo de vida de acciones (notificación, ejecución, verificación).
- Cumplimineto Normativo y certificacion del sistema SGCN  
- Dashboard de mejora continua con métricas de desempeño.  
- Reporte de Revisión por la Dirección totalmente automatizado con anexos de evidencia.  

### 2.3 Portal Empresarial "Fenix-SGCN Portafolio"
- Consola multi-empresa con comparativos de madurez y resiliencia.  
- White-labeling completo (logo, colores, dominio).  
- SLA y cumplimiento contractual con dashboards por cliente.  
- Consolidación de informes y facturación automática (Stripe/PayPal).  
- Benchmarking anónimo entre empresas del mismo sector.  

## 3. Estructura de Planes y Modelo de Negocio 
* Plan Estándar: 199USD por mes, hasta 50 Empleados, Hasta 10 procesos en el SGCN, primeros 5 módulos (Gobierno, Riesgos -ARA, BIA, Estrategia y Planes, 50GB almacén documental y retención 1 año.
* Plan Profesional:399USD por mes, hasta 150 Empleados, Hasta 30 procesos en el SGCN, Todo lo del Plan Básico + Módulo 6 y 7 (Pruebas y QA). 200GB almacén documental y retención 2 año.
* Plan Premium: Personalizado por año, ilimitados Empleados y procesos en el SGCN, Todo lo del profesional + soporte preferencial para pruebas y atención de incidentes hasta 2 por año.500GB almacén documental y retención 3 año.
* Plan Empresarial "Portafolio": Todo lo del Premium + Dashboard "Fenix-SGCN Portafolio", personalización de marca, soporte prioritario.
---

## 4. Requerimientos no funcionales y de seguridad
- **Disponibilidad:** SLA ≥ 99.95%.  
- **Performance:** respuesta API < 200ms, escalado automático Kubernetes.  
- **Seguridad:** TLS1.3, AES-256, WAF, DLP, Zero Trust Architecture.  
- **Identidad:** OIDC, SAML, SCIM, MFA, soporte de políticas passwordless (FIDO2/WebAuthn).  
- **Auditoría:** logs inmutables (blockchain opcional para trazabilidad).  
- **Backups:** RPO ≤ 15 min, RTO ≤ 1h en recuperación de plataforma.  
- **Cumplimiento:** GDPR, SOC2, ISO27001, ISO22301, ISO31000.  
- ** Soporte inicial para español, inglés y portugués
- ** Estructura preparada para fácil expansión a otros idiomas
- ** Formatos de fecha y número según localización
- ** Soporte para múltiples monedas (dólares americanos, real brasileño y pesos colombianos)
- ** Soporte de modo de pantalla: claro, oscuro o sistema.
por defecto debe arrancar en español, pesos colombianos y modo claro.

---
## 5. Arquitectura técnica recomendada
- **API-first** con OpenAPI 3.1, GraphQL opcional.  
- **Backend:** NestJS/Node.js con microservicios, Prisma ORM.  
- **Frontend:** Next.js + React + internacionalización i18next.  
- **DB:** PostgreSQL multi-tenant (schema-per-tenant), soporte DB-per-tenant para enterprise.  
- **Storage:** S3-compatible con versionado, retención, WORM.  
- **Orquestación:** Kafka para eventos críticos, Redis para cache.  
- **Monitoring:** Prometheus, Grafana, OpenTelemetry, Sentry.  
- **Infraestructura:** Kubernetes multi-región, Terraform, ArgoCD.  
- **Testing:** Vitest/Jest + Playwright E2E + Chaos Engineering.  

---
## 6. Integraciones mínimas y avanzadas
1. Identity providers (Okta, Azure AD, Auth0).  
2. Comunicaciones (Twilio, SendGrid, WhatsApp, Teams, Slack).  
3. ITSM (ServiceNow, Jira).  
4. Observabilidad (Prometheus, Grafana, ELK, Sentry).  
5. Storage (S3, GCS, Azure Blob).  
6. CRM/Billing (HubSpot, Stripe, PayPal, ).  
7. Threat Intel (IBM X-Force, Recorded Future).  
8. Clima y riesgo físico (OpenWeather, Climate API).  

---
## 7. Marco normativo y Mapeo a estándares. 
- **ISO 22301:2019** – Requisitos de SGCN, cobertura (planificación, operación, auditoría, mejora).
- **ISO 22313:2020** – Guía para implementación de SGCN.  
- **ISO 22316:2017** – Resiliencia organizacional.  
- **ISO 22317:2021** – Análisis de Impacto al Negocio (BIA).  
- **ISO 22318:2021** – Continuidad en la cadena de suministro.  
- **ISO 22330:2021** – Continuidad del recurso humano.  
- **ISO 22331:2018** – Estrategia y planificación de continuidad.  
- **ISO 31000:2018** – marco de riesgos integrado con gobernanza y métricas. 
- **ISO/IEC 27001:2022** – Seguridad de la información (integración complementaria).
-**NIST:** integración con CSF (Identify, Protect, Detect, Respond, Recover).  
-**FFIEC:** aplicable a sector financiero (continuidad operativa y ciber).  
-**GDPR:** cumplimiento en protección de datos y anonimización. 

---
## 8. Roadmap estratégico (sugerido)

### MVP 
- Core BIA/ARA + editor de planes + dashboard KPIs.  
- Autenticación OIDC/MFA + gestión documental S3.  
- Export PDF de BIA/BCP.

### Release 2
- Orquestador de planes en vivo.  
- Pruebas automatizadas con scoring.  
- Integración Twilio/Teams/Slack.  
- Evidence Bundle exportable.  

### Release 3
- SCIM + white-label Armonía Portafolio.  
- AI Advisor (riesgo predictivo, sugerencias de planes).  
- Integración ITSM (ServiceNow, Jira).  

### Release 4 
- Chaos Engineering para validar resiliencia.  
- Benchmarking sectorial.  
- Cumplimiento extendido (GDPR, NIST, FFIEC).  

---

## 9. Criterios de aceptación / entregables
- API documentada con OpenAPI y colección Postman.  
- UX completa: crear BIA, generar BCP, ejecutar plan y prueba.  
- Evidencia auditable exportable (PDF/JSON firmados).  
- Pruebas E2E automatizadas con ≥95% cobertura.  
- Preparación despliegue a produccion.  

---

## 10. Notas finales
- Mantener terminología estándar (RTO, RPO, MTPD, MBCO).  
- Se debe tener la funcionalidad total
- IA como asistente, no sustituto de expertos.  
- Exportabilidad y evidencia certificable como diferenciador clave.  
- Roadmap prioriza MVP competitivo y escalabilidad global.  

---

