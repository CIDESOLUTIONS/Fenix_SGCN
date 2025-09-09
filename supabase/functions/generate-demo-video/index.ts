import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Creating SGCN application walkthrough demo");
    
    // Current application URL
    const appUrl = "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev";
    
    // Define the application flow sequence
    const pageSequence = [
      { 
        url: `${appUrl}/`, 
        title: "Landing Page - Fenix SGCN",
        description: "Página principal mostrando 'Protege tu empresa con un SGCN robusto y confiable'",
        duration: 3000 
      },
      { 
        url: `${appUrl}/auth`, 
        title: "Registro de Cliente",
        description: "Formulario de registro para nuevos usuarios del sistema",
        duration: 2500 
      },
      { 
        url: `${appUrl}/dashboard`, 
        title: "Dashboard Principal",
        description: "Panel de control con métricas y estado del sistema SGCN",
        duration: 4000 
      },
      { 
        url: `${appUrl}/planeacion`, 
        title: "Procesos Críticos",
        description: "Identificación y gestión de procesos críticos del negocio",
        duration: 3500 
      },
      { 
        url: `${appUrl}/risk-analysis`, 
        title: "Análisis de Riesgos",
        description: "Matrices interactivas y mapas de calor para gestión de riesgos",
        duration: 3500 
      },
      { 
        url: `${appUrl}/business-impact-analysis`, 
        title: "Business Impact Analysis",
        description: "Evaluación de impactos y dependencias empresariales",
        duration: 3500 
      },
      { 
        url: `${appUrl}/strategy-criteria`, 
        title: "Criterios de Estrategia",
        description: "Herramientas para selección de estrategias de continuidad",
        duration: 3000 
      },
      { 
        url: `${appUrl}/continuity-strategies`, 
        title: "Estrategias de Continuidad",
        description: "Configuración detallada de estrategias de continuidad de negocio",
        duration: 3500 
      },
      { 
        url: `${appUrl}/plans`, 
        title: "Planes de Continuidad",
        description: "Gestión de planes de implementación con cronogramas",
        duration: 3500 
      },
      { 
        url: `${appUrl}/pruebas`, 
        title: "Resultados de Pruebas",
        description: "Consolidación de resultados de pruebas y validaciones",
        duration: 3000 
      }
    ];

    // Return the walkthrough data for frontend simulation
    return new Response(JSON.stringify({ 
      success: true,
      walkthrough: pageSequence,
      message: "Recorrido completo de Fenix SGCN preparado",
      totalDuration: pageSequence.reduce((total, page) => total + page.duration, 0),
      description: "Demo interactivo navegando por todas las páginas de Fenix SGCN"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating walkthrough demo:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});