import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Replicate from "https://esm.sh/replicate@0.25.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set');
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    const body = await req.json();

    // Check status if predictionId is provided
    if (body.predictionId) {
      console.log("Checking video generation status:", body.predictionId);
      const prediction = await replicate.predictions.get(body.predictionId);
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate demo video for SGCN process
    console.log("Generating SGCN demo video");
    
    const prompt = `
    A professional screencast video showing the complete process of creating a Business Continuity Management System (SGCN):

    1. Login screen of Fenix-SGCN platform
    2. Modern dashboard with KPI metrics and charts
    3. Risk Analysis module with Monte Carlo simulations and heat maps
    4. Business Impact Analysis with dependency mapping visualization
    5. Continuity Strategies selection with drag & drop editor
    6. Plans creation with visual workflow builder
    7. Testing module with automatic scoring and results
    8. Final compliance reports and certificates

    The video should be professional, corporate style, showing smooth transitions between modules, data visualization, and user interactions. Clean modern UI with blue and green color scheme. Duration: 30-45 seconds.
    `;

    const output = await replicate.run(
      "deforum/deforum_stable_diffusion",
      {
        input: {
          prompts: `0: ${prompt}`,
          animation_mode: "2D",
          max_frames: 90, // 3 seconds at 30fps
          strength: 0.7,
          width: 1280,
          height: 720,
          fps: 30,
          zoom: "0:(1.00)",
          translation_x: "0:(0)",
          translation_y: "0:(0)",
          rotation: "0:(0)",
        }
      }
    );

    console.log("Video generation response:", output);
    return new Response(JSON.stringify({ output }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("Error generating demo video:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});