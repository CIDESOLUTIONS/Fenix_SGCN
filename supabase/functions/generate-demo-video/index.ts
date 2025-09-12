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
    console.log("Generating SGCN application video walkthrough using Browserless");
    
    const BROWSERLESS_API_KEY = Deno.env.get('BROWSERLESS_API_KEY');
    if (!BROWSERLESS_API_KEY) {
      throw new Error('BROWSERLESS_API_KEY is not configured');
    }

    // Current application URL
    const appUrl = "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev";
    
    // Define the application flow sequence for video generation
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

    console.log("Starting video generation with Browserless API");

    // Generate video using Browserless API
    const videoResponse = await fetch('https://chrome.browserless.io/screencast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${BROWSERLESS_API_KEY}`,
      },
      body: JSON.stringify({
        url: pageSequence[0].url,
        options: {
          fps: 24,
          format: 'mp4',
          quality: 80,
          speed: 1,
          crop: {
            x: 0,
            y: 0,
            width: 1920,
            height: 1080
          }
        },
        gotoOptions: {
          waitUntil: 'networkidle2',
          timeout: 30000
        },
        script: `
          async function createWalkthrough() {
            const pages = ${JSON.stringify(pageSequence)};
            
            for (let i = 0; i < pages.length; i++) {
              const page = pages[i];
              console.log('Navigating to:', page.title);
              
              // Navigate to the page
              await page.goto(page.url, { waitUntil: 'networkidle2' });
              
              // Wait for the page to fully load
              await page.waitForTimeout(2000);
              
              // Scroll slowly to show content
              await page.evaluate(() => {
                return new Promise((resolve) => {
                  let totalHeight = 0;
                  const distance = 100;
                  const timer = setInterval(() => {
                    const scrollHeight = document.body.scrollHeight;
                    window.scrollBy(0, distance);
                    totalHeight += distance;

                    if(totalHeight >= scrollHeight - window.innerHeight){
                      clearInterval(timer);
                      // Scroll back to top
                      window.scrollTo(0, 0);
                      resolve();
                    }
                  }, 100);
                });
              });
              
              // Wait for the specified duration
              await page.waitForTimeout(page.duration - 2000);
            }
            
            console.log('Walkthrough completed');
          }
          
          await createWalkthrough();
        `
      })
    });

    if (!videoResponse.ok) {
      const errorText = await videoResponse.text();
      console.error('Browserless API error:', errorText);
      throw new Error(`Browserless API error: ${videoResponse.status} - ${errorText}`);
    }

    // Get the video data
    const videoBlob = await videoResponse.blob();
    const videoBase64 = btoa(String.fromCharCode(...new Uint8Array(await videoBlob.arrayBuffer())));

    console.log("Video generation completed successfully");

    return new Response(JSON.stringify({ 
      success: true,
      videoData: `data:video/mp4;base64,${videoBase64}`,
      walkthrough: pageSequence,
      message: "Video recorrido de Fenix SGCN generado exitosamente",
      totalDuration: pageSequence.reduce((total, page) => total + page.duration, 0),
      description: "Video demo completo navegando por todas las páginas de Fenix SGCN"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating video walkthrough:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false,
      fallbackWalkthrough: [
        { 
          url: "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev/", 
          title: "Landing Page - Fenix SGCN",
          description: "Página principal del sistema SGCN",
          duration: 3000 
        }
      ]
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});