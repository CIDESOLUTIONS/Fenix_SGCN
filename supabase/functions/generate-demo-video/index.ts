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
    const body = await req.json();
    const BROWSERLESS_API_KEY = Deno.env.get('BROWSERLESS_API_KEY');
    
    if (!BROWSERLESS_API_KEY) {
      throw new Error('BROWSERLESS_API_KEY is required');
    }
    
    console.log("Creating SGCN application walkthrough video with Browserless");
    
    // Current application URL
    const appUrl = "https://d8747366-904a-4d40-a623-95cf67b7346f.sandbox.lovable.dev";
    
    // Define the application flow sequence
    const pageSequence = [
      { url: `${appUrl}/`, description: "Landing page de Fenix SGCN", duration: 3000 },
      { url: `${appUrl}/auth`, description: "Registro de cliente", duration: 2500 }, 
      { url: `${appUrl}/auth`, description: "Login de usuario", duration: 2500 },
      { url: `${appUrl}/dashboard`, description: "Dashboard principal", duration: 4000 },
      { url: `${appUrl}/planeacion`, description: "Procesos críticos", duration: 3500 },
      { url: `${appUrl}/risk-analysis`, description: "Mapa de riesgos", duration: 3500 },
      { url: `${appUrl}/business-impact-analysis`, description: "Mapa de BIA", duration: 3500 },
      { url: `${appUrl}/strategy-criteria`, description: "Selección de estrategia", duration: 3000 },
      { url: `${appUrl}/continuity-strategies`, description: "Estrategias", duration: 3500 },
      { url: `${appUrl}/plans`, description: "Planes de continuidad", duration: 3500 },
      { url: `${appUrl}/pruebas`, description: "Resultados de pruebas", duration: 3000 },
      { url: `${appUrl}/`, description: "Regreso al hero", duration: 3000 }
    ];

    // Create video using Browserless - using correct API endpoint
    const videoResponse = await fetch('https://chrome.browserless.io/screencast', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${BROWSERLESS_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: pageSequence[0].url,
        viewport: { width: 1920, height: 1080 },
        fullPage: false,
        quality: 90,
        type: 'mp4',
        duration: 30000, // 30 seconds total
        frames: [
          ...pageSequence.map((page, index) => ({
            url: page.url,
            timestamp: index * 2500 // 2.5 seconds per page
          }))
        ]
      })
    });

    if (!videoResponse.ok) {
      console.error("Browserless API response:", await videoResponse.text());
      
      // Fallback: create a demo video placeholder that works
      const demoVideoUrl = `data:video/mp4;base64,AAAAIGZ0eXBpc29tAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAAAsdtZGF0AAACvAYF//+p3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE2MSByMzA1OSBkZTBkMTA0IC0gSC4yNjQvTVBFRy00IEFWQSA=`;
      
      return new Response(JSON.stringify({ 
        output: [demoVideoUrl],
        message: "Video demo del recorrido SGCN (modo demo)",
        sequence: pageSequence,
        description: "Demo del flujo completo de Fenix SGCN",
        note: "Video en modo demo - para video real verifica tu BROWSERLESS_API_KEY"
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    const videoBuffer = await videoResponse.arrayBuffer();
    const videoBase64 = btoa(String.fromCharCode(...new Uint8Array(videoBuffer)));
    const videoDataUrl = `data:video/mp4;base64,${videoBase64}`;

    console.log("Video generated successfully, size:", videoBuffer.byteLength);

    return new Response(JSON.stringify({ 
      output: [videoDataUrl],
      message: "Video demo del recorrido SGCN generado exitosamente",
      sequence: pageSequence,
      description: "Video real navegando por todas las páginas de Fenix SGCN"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating application walkthrough video:", error);
    return new Response(JSON.stringify({ 
      error: error.message,
      details: "Asegúrate de haber configurado BROWSERLESS_API_KEY correctamente"
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});