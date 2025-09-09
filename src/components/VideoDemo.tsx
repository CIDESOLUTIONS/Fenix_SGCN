import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X, Loader } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import demoThumbnail from '@/assets/sgcn-demo-thumbnail.jpg';

const VideoDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [predictionId, setPredictionId] = useState<string | null>(null);

  const generateDemoVideo = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-demo-video', {
        body: { action: 'generate' }
      });

      if (error) throw error;

      if (data.output) {
        if (Array.isArray(data.output) && data.output.length > 0) {
          setVideoUrl(data.output[0]);
          setIsOpen(true);
        } else if (data.output.id) {
          // If it's a prediction, start polling
          setPredictionId(data.output.id);
          pollVideoStatus(data.output.id);
        }
      }
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: "Error",
        description: "No se pudo generar el video demo. Intenta de nuevo.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const pollVideoStatus = async (id: string) => {
    const maxAttempts = 60; // 5 minutes max
    let attempts = 0;

    const poll = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('generate-demo-video', {
          body: { predictionId: id }
        });

        if (error) throw error;

        if (data.status === 'succeeded' && data.output) {
          setVideoUrl(data.output[0]);
          setIsOpen(true);
          setIsGenerating(false);
          return;
        }

        if (data.status === 'failed') {
          throw new Error('Video generation failed');
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(poll, 5000); // Poll every 5 seconds
        } else {
          throw new Error('Video generation timeout');
        }
      } catch (error) {
        console.error('Error polling video status:', error);
        setIsGenerating(false);
        toast({
          title: "Error",
          description: "No se pudo generar el video demo. Intenta de nuevo.",
          variant: "destructive"
        });
      }
    };

    poll();
  };

  const openDemoDialog = () => {
    // No generamos video, solo mostramos el demo interactivo
    setIsOpen(true);
  };

  return (
    <>
      <div 
        className="relative cursor-pointer group"
        onClick={openDemoDialog}
      >
        <img 
          src={demoThumbnail} 
          alt="Demo del proceso SGCN" 
          className="w-full h-auto rounded-2xl shadow-elegant transition-all duration-300 group-hover:shadow-xl group-hover:scale-[1.02]"
        />
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {isGenerating ? (
            <div className="bg-white/90 rounded-full p-6">
              <Loader className="h-12 w-12 text-primary animate-spin" />
            </div>
          ) : (
            <Button size="lg" className="bg-white/90 text-primary hover:bg-white rounded-full p-6">
              <Play className="h-12 w-12 fill-current" />
            </Button>
          )}
        </div>

        {/* Loading overlay */}
        {isGenerating && (
          <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
            <div className="text-center text-white">
              <Loader className="h-8 w-8 animate-spin mx-auto mb-2" />
              <p className="text-sm">Generando video demo...</p>
            </div>
          </div>
        )}
      </div>

      {/* Video Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl w-full p-0" aria-describedby="video-demo-description">
          <div className="sr-only">
            <h2 id="video-demo-title">Demo del Sistema SGCN</h2>
            <p id="video-demo-description">Video demostrativo del proceso completo de gestión de continuidad de negocio</p>
          </div>
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {videoUrl ? (
              <video
                src={videoUrl}
                controls
                autoPlay
                className="w-full h-auto rounded-lg"
                poster={demoThumbnail}
              >
                Tu navegador no soporta el elemento de video.
              </video>
            ) : (
              <div className="aspect-video bg-gradient-hero rounded-lg flex flex-col items-center justify-center p-8">
                <div className="text-center text-white max-w-2xl">
                  <h3 className="text-2xl font-bold mb-4">Demo Interactivo SGCN</h3>
                  <p className="text-lg mb-6">Explora las funcionalidades de Fenix SGCN</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-left bg-white/10 rounded-lg p-6">
                    <div className="space-y-2">
                      <h4 className="font-semibold">Proceso Completo:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Landing Page</li>
                        <li>• Registro de Usuario</li>
                        <li>• Dashboard Principal</li>
                        <li>• Análisis de Procesos Críticos</li>
                        <li>• Mapa de Riesgos</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Funcionalidades:</h4>
                      <ul className="text-sm space-y-1">
                        <li>• Business Impact Analysis</li>
                        <li>• Selección de Estrategias</li>
                        <li>• Planes de Continuidad</li>
                        <li>• Pruebas y Validación</li>
                        <li>• Reportes Consolidados</li>
                      </ul>
                    </div>
                  </div>
                  
                  <p className="text-sm text-white/80 mt-4">
                    Navega por la aplicación para ver todas las funcionalidades en acción
                  </p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoDemo;