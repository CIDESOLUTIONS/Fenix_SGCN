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
        <DialogContent className="max-w-4xl w-full p-6 bg-background">
          <div className="sr-only">
            <h2 id="video-demo-title">Demo del Sistema SGCN</h2>
            <p id="video-demo-description">Video demostrativo del proceso completo de gestión de continuidad de negocio</p>
          </div>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="mt-8">
              <div className="aspect-video bg-gradient-to-br from-primary to-primary-dark rounded-lg flex flex-col items-center justify-center p-8 text-white">
                <div className="text-center max-w-2xl">
                  <h3 className="text-3xl font-bold mb-6">Demo Interactivo SGCN</h3>
                  <p className="text-lg mb-8 opacity-90">Explora todas las funcionalidades de Fenix SGCN</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left bg-white/10 backdrop-blur rounded-lg p-6">
                    <div className="space-y-3">
                      <h4 className="font-bold text-lg border-b border-white/20 pb-2">Proceso Completo:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Landing Page</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Registro de Usuario</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Dashboard Principal</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Procesos Críticos</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Mapa de Riesgos</span>
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <h4 className="font-bold text-lg border-b border-white/20 pb-2">Funcionalidades:</h4>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Business Impact Analysis</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Selección de Estrategias</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Planes de Continuidad</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Pruebas y Validación</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-white rounded-full"></span>
                          <span>Reportes Consolidados</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
                    <p className="text-sm opacity-90">
                      💡 <strong>Navega por la aplicación</strong> para experimentar todas las funcionalidades en tiempo real
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoDemo;