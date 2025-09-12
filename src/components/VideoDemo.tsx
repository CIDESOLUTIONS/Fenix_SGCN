import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X, Loader, ExternalLink, Download, Clock } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import demoThumbnail from '@/assets/sgcn-demo-thumbnail.jpg';

interface WalkthroughStep {
  url: string;
  title: string;
  description: string;
  duration: number;
}

const VideoDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [walkthrough, setWalkthrough] = useState<WalkthroughStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoData, setVideoData] = useState<string | null>(null);

  const generateWalkthrough = async () => {
    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke('generate-demo-video', {
        body: { action: 'generate' }
      });

      if (error) throw error;

      if (data.success) {
        setWalkthrough(data.walkthrough);
        if (data.videoData) {
          setVideoData(data.videoData);
          toast({
            title: "¡Video generado exitosamente!",
            description: "Recorrido completo de Fenix SGCN listo para reproducir",
          });
        } else {
          toast({
            title: "¡Demo listo!",
            description: data.message || "Recorrido interactivo preparado",
          });
        }
        setIsOpen(true);
      } else {
        throw new Error(data.error || "Error desconocido");
      }
    } catch (error) {
      console.error('Error generating walkthrough:', error);
      toast({
        title: "Error",
        description: `Error generando el video: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const playWalkthrough = async () => {
    if (walkthrough.length === 0) return;
    
    setIsPlaying(true);
    setCurrentStep(0);
    
    for (let i = 0; i < walkthrough.length; i++) {
      setCurrentStep(i);
      
      // Open each page in the same window
      const newWindow = window.open(walkthrough[i].url, '_blank');
      
      // Wait for the duration of this step
      await new Promise(resolve => setTimeout(resolve, walkthrough[i].duration));
      
      if (newWindow) {
        newWindow.close();
      }
    }
    
    setIsPlaying(false);
    toast({
      title: "¡Recorrido completado!",
      description: "Has visto todas las páginas de Fenix SGCN",
    });
  };

  const openDemoDialog = () => {
    generateWalkthrough();
  };

  const downloadVideo = () => {
    if (videoData) {
      const link = document.createElement('a');
      link.href = videoData;
      link.download = 'fenix-sgcn-demo.mp4';
      link.click();
    }
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

      {/* Video Demo Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl w-full p-6" aria-describedby="video-demo-description">
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            {videoData ? "Video Demo Fenix SGCN" : "Recorrido Completo Fenix SGCN"}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mb-6">
            {videoData 
              ? "Video recorrido automático por todas las funcionalidades del sistema"
              : "Navega por todas las páginas del sistema de gestión de continuidad de negocio"
            }
          </DialogDescription>
          
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2 z-10"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                <p className="text-lg font-medium">Generando video demo...</p>
                <p className="text-sm text-muted-foreground">
                  Creando recorrido automático con Browserless - Esto puede tomar 2-3 minutos
                </p>
              </div>
            ) : videoData ? (
              <div className="space-y-6">
                {/* Video Player */}
                <div className="bg-muted/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold mb-4">Video Demo Generado</h3>
                  <div className="aspect-video bg-black rounded-lg overflow-hidden">
                    <video 
                      controls 
                      className="w-full h-full"
                      poster={demoThumbnail}
                    >
                      <source src={videoData} type="video/mp4" />
                      Tu navegador no soporta el elemento video.
                    </video>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      Duración total: {Math.round(walkthrough.reduce((total, step) => total + step.duration, 0) / 1000)} segundos
                    </div>
                    <Button
                      onClick={downloadVideo}
                      variant="outline"
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <Download className="h-4 w-4" />
                      <span>Descargar Video</span>
                    </Button>
                  </div>
                </div>

                {/* Pages List */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-lg">Páginas incluidas en el recorrido:</h4>
                  <div className="grid gap-4 max-h-96 overflow-y-auto">
                    {walkthrough.map((step, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg border bg-background hover:bg-muted/50 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="font-medium text-base mb-1">{step.title}</h5>
                            <p className="text-sm text-muted-foreground mb-2">
                              {step.description}
                            </p>
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              {step.duration / 1000}s en el video
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(step.url, '_blank')}
                            className="flex items-center space-x-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            <span>Visitar</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : walkthrough.length > 0 ? (
              <div className="space-y-6">
                {/* Control Panel */}
                <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold">Demo Interactivo</h3>
                    <Button 
                      onClick={playWalkthrough}
                      disabled={isPlaying}
                      className="bg-white text-primary hover:bg-white/90"
                    >
                      {isPlaying ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Reproduciendo...
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar Recorrido
                        </>
                      )}
                    </Button>
                  </div>
                  
                  {isPlaying && (
                    <div className="bg-white/10 rounded p-3">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="font-medium">
                          Paso {currentStep + 1} de {walkthrough.length}: {walkthrough[currentStep]?.title}
                        </span>
                      </div>
                      <p className="text-sm opacity-90">{walkthrough[currentStep]?.description}</p>
                    </div>
                  )}
                </div>

                {/* Walkthrough Steps */}
                <div className="grid gap-4 max-h-96 overflow-y-auto">
                  {walkthrough.map((step, index) => (
                    <div 
                      key={index}
                      className={`p-4 border rounded-lg transition-all ${
                        currentStep === index && isPlaying 
                          ? 'border-primary bg-primary/5 shadow-md' 
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              currentStep === index && isPlaying
                                ? 'bg-primary text-white'
                                : 'bg-muted text-muted-foreground'
                            }`}>
                              {index + 1}
                            </span>
                            <h4 className="font-semibold">{step.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{step.description}</p>
                          <div className="text-xs text-muted-foreground">
                            Duración: {step.duration / 1000}s
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(step.url, '_blank')}
                          className="shrink-0"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visitar
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center text-sm text-muted-foreground">
                  <p>El recorrido completo toma aproximadamente {Math.ceil(walkthrough.reduce((total, step) => total + step.duration, 0) / 1000)} segundos</p>
                  <p className="mt-1">Cada página se abrirá automáticamente durante la reproducción</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <Loader className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
                <h3 className="text-xl font-semibold mb-2">Preparando recorrido...</h3>
                <p className="text-muted-foreground">Configurando la secuencia de páginas de Fenix SGCN</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoDemo;