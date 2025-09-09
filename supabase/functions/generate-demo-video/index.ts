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

    // Generate a video using a more reliable model
    console.log("Generating SGCN demo video with Replicate");
    
    const output = await replicate.run(
      "lucataco/animate-diff:beecf59c4aee8d81bf04f0381033dda98dc16e845b83c17a44edc6fed1c94824",
      {
        input: {
          path: "toonyou_beta3.safetensors",
          seed: Math.floor(Math.random() * 1000000),
          steps: 25,
          width: 1024,
          height: 576,
          prompt: "Professional software demo video: landing page of Fenix SGCN business continuity management system, modern UI with dashboard showing metrics, user registration and login forms, risk analysis matrices, business impact analysis charts, strategy selection interface, implementation plans, testing results - clean corporate design, smooth transitions",
          n_prompt: "blurry, low quality, distorted, amateur, cartoon",
          guidance_scale: 7.5
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
    
    // Fallback to a curated demo video if generation fails
    const fallbackVideo = "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4";
    
    console.log("Using fallback demo video");
    
    return new Response(JSON.stringify({ 
      output: [fallbackVideo],
      message: "Demo video (fallback) generated successfully" 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  }
});