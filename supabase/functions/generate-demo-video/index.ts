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
    console.log("Generating SGCN application walkthrough demo");
    
    const BROWSERLESS_API_KEY = Deno.env.get('BROWSERLESS_API_KEY');
    console.log("BROWSERLESS_API_KEY available:", !!BROWSERLESS_API_KEY);
    
    // Current application URL
    const appUrl = "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev";
    
    // Define the application flow sequence
    const pageSequence = [
      { 
        url: `${appUrl}/`, 
        title: "Landing Page - Fenix SGCN",
        description: "Página principal mostrando 'Protege tu empresa con un SGCN robusto y confiable'",
        duration: 4000 
      },
      { 
        url: `${appUrl}/auth`, 
        title: "Registro de Cliente",
        description: "Formulario de registro para nuevos usuarios del sistema",
        duration: 3000 
      },
      { 
        url: `${appUrl}/dashboard`, 
        title: "Dashboard Principal",
        description: "Panel de control con métricas y estado del sistema SGCN",
        duration: 5000 
      },
      { 
        url: `${appUrl}/planeacion`, 
        title: "Procesos Críticos",
        description: "Identificación y gestión de procesos críticos del negocio",
        duration: 4000 
      },
      { 
        url: `${appUrl}/risk-analysis`, 
        title: "Análisis de Riesgos",
        description: "Matrices interactivas y mapas de calor para gestión de riesgos",
        duration: 4000 
      },
      { 
        url: `${appUrl}/business-impact-analysis`, 
        title: "Business Impact Analysis",
        description: "Evaluación de impactos y dependencias empresariales",
        duration: 4000 
      },
      { 
        url: `${appUrl}/strategy-criteria`, 
        title: "Criterios de Estrategia",
        description: "Herramientas para selección de estrategias de continuidad",
        duration: 3500 
      },
      { 
        url: `${appUrl}/continuity-strategies`, 
        title: "Estrategias de Continuidad",
        description: "Configuración detallada de estrategias de continuidad de negocio",
        duration: 4000 
      },
      { 
        url: `${appUrl}/plans`, 
        title: "Planes de Continuidad",
        description: "Gestión de planes de implementación con cronogramas",
        duration: 4000 
      },
      { 
        url: `${appUrl}/pruebas`, 
        title: "Resultados de Pruebas",
        description: "Consolidación de resultados de pruebas y validaciones",
        duration: 3500 
      }
    ];

    // If Browserless API is available, try to generate video
    if (BROWSERLESS_API_KEY) {
      console.log("Attempting to generate video with Browserless API");

      try {
        // Simplified approach for video generation
        const videoResponse = await fetch('https://chrome.browserless.io/screenshot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${BROWSERLESS_API_KEY}`,
          },
          body: JSON.stringify({
            url: pageSequence[0].url,
            options: {
              fullPage: true,
              type: 'png',
              quality: 100
            },
            gotoOptions: {
              waitUntil: 'networkidle2',
              timeout: 30000
            }
          })
        });

        if (videoResponse.ok) {
          console.log("Screenshot generated successfully - creating demo data");
          
          // For now, return the walkthrough without actual video since Browserless screencast may need different setup
          return new Response(JSON.stringify({ 
            success: true,
            walkthrough: pageSequence,
            message: "Recorrido de Fenix SGCN preparado - Video en desarrollo",
            totalDuration: pageSequence.reduce((total, page) => total + page.duration, 0),
            description: "Demo interactivo navegando por todas las páginas de Fenix SGCN",
            videoAvailable: false
          }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        } else {
          console.log("Browserless screenshot failed, falling back to interactive mode");
        }
      } catch (browserlessError) {
        console.error("Browserless API error:", browserlessError);
      }
    }

    // Fallback: Return interactive walkthrough
    console.log("Returning interactive walkthrough");
    return new Response(JSON.stringify({ 
      success: true,
      walkthrough: pageSequence,
      message: "Recorrido interactivo de Fenix SGCN preparado",
      totalDuration: pageSequence.reduce((total, page) => total + page.duration, 0),
      description: "Demo interactivo navegando por todas las páginas de Fenix SGCN",
      videoAvailable: false
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error in generate-demo-video function:", error);
    
    // Always return a successful fallback
    const fallbackSequence = [
      { 
        url: "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev/", 
        title: "Landing Page - Fenix SGCN",
        description: "Página principal del sistema SGCN",
        duration: 3000 
      },
      { 
        url: "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev/dashboard", 
        title: "Dashboard Principal",
        description: "Panel de control del sistema",
        duration: 4000 
      }
    ];

    return new Response(JSON.stringify({ 
      success: true,
      walkthrough: fallbackSequence,
      message: "Demo básico de Fenix SGCN disponible",
      totalDuration: fallbackSequence.reduce((total, page) => total + page.duration, 0),
      description: "Recorrido básico por las páginas principales",
      videoAvailable: false,
      note: "Modo demo simplificado activo"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});