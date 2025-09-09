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
    const body = await req.json();
    const REPLICATE_API_KEY = Deno.env.get('REPLICATE_API_KEY');
    
    if (!REPLICATE_API_KEY) {
      throw new Error('REPLICATE_API_KEY is not set');
    }

    const replicate = new Replicate({
      auth: REPLICATE_API_KEY,
    });

    // If it's a status check request
    if (body.predictionId) {
      console.log("Checking status for prediction:", body.predictionId);
      const prediction = await replicate.predictions.get(body.predictionId);
      console.log("Status check response:", prediction);
      return new Response(JSON.stringify(prediction), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate demo video showing SGCN process flow
    const demoPrompt = `Create a professional software demo video showing:
    1. A modern landing page with "Fenix SGCN" branding and business continuity management features
    2. User registration and login process with clean forms
    3. A comprehensive dashboard showing business continuity metrics and status indicators
    4. Critical business process mapping interface with interactive elements
    5. Risk analysis dashboard with risk matrices and heat maps
    6. Business Impact Analysis (BIA) interface showing impact assessments and dependencies
    7. Continuity strategy selection tools with multiple strategic options
    8. Strategic planning interface with detailed strategy configurations
    9. Implementation plans dashboard with timelines and action items
    10. Testing results consolidation showing comprehensive test outcomes
    11. Return to the hero section with "Protege tu empresa con un SGCN robusto y confiable" message

    Style: Professional software interface, modern design, clean UI, business-focused color scheme, 16:9 aspect ratio, smooth transitions between screens, realistic software demo appearance`;

    console.log("Generating SGCN demo video with Replicate");
    
    const output = await replicate.run(
      "deforum/deforum_stable_diffusion",
      {
        input: {
          animation_prompts: demoPrompt,
          max_frames: 200,
          strength: 0.8,
          guidance_scale: 15,
          steps: 25,
          seed: Math.floor(Math.random() * 1000000),
          fps: 12,
          width: 1024,
          height: 576,
          interpolate_prompts: true,
          animation_mode: "2D"
        }
      }
    );

    console.log("Video generation response:", output);
    
    return new Response(JSON.stringify({ 
      output: output,
      message: "Demo video generated successfully" 
    }), {
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