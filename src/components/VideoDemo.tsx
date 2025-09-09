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
    // Generar video real del recorrido de la aplicación
    generateDemoVideo();
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
        <DialogContent className="max-w-6xl w-full p-0" aria-describedby="video-demo-description">
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
              <div className="relative">
                <video
                  src={videoUrl}
                  controls
                  autoPlay
                  className="w-full h-auto rounded-lg"
                  poster={demoThumbnail}
                >
                  Tu navegador no soporta el elemento de video.
                </video>
                <div className="absolute bottom-4 left-4 bg-black/70 text-white px-4 py-2 rounded-lg">
                  <p className="text-sm font-medium">Recorrido Completo Fenix SGCN</p>
                  <p className="text-xs opacity-80">Landing → Registro → Dashboard → Riesgos → BIA → Estrategias → Planes → Pruebas</p>
                </div>
              </div>
            ) : isGenerating ? (
              <div className="aspect-video bg-gradient-to-br from-primary to-blue-600 rounded-lg flex items-center justify-center p-8">
                <div className="text-center text-white">
                  <Loader className="h-16 w-16 animate-spin mx-auto mb-6" />
                  <h3 className="text-2xl font-bold mb-4">Generando Video del Recorrido</h3>
                  <p className="text-lg mb-4 opacity-90">Capturando las páginas de Fenix SGCN...</p>
                  <div className="bg-white/10 rounded-lg p-4 max-w-md mx-auto">
                    <div className="text-sm space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span>Landing Page</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                        <span>Registro y Login</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                        <span>Dashboard y Módulos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span>Análisis y Estrategias</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm opacity-70 mt-4">Esto puede tomar unos minutos...</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center p-8">
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">Error al cargar el video</h3>
                  <p className="text-muted-foreground mb-4">No se pudo generar el video del recorrido</p>
                  <Button onClick={generateDemoVideo} variant="outline">
                    Intentar de nuevo
                  </Button>
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