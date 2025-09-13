import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Play, X, Download } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import demoThumbnail from '@/assets/sgcn-demo-thumbnail.jpg';
import demoVideo from '@/assets/SGCN_Video_ Demo.mp4';

const VideoDemo = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openDemoDialog = () => {
    setIsOpen(true);
  };

  const downloadVideo = () => {
    const link = document.createElement('a');
    link.href = demoVideo;
    link.download = 'fenix-sgcn-demo.mp4';
    link.click();
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
          <Button size="lg" className="bg-white/90 text-primary hover:bg-white rounded-full p-6">
            <Play className="h-12 w-12 fill-current" />
          </Button>
        </div>
      </div>

      {/* Video Demo Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-6xl w-full p-6" aria-describedby="video-demo-description">
          <DialogTitle className="text-2xl font-bold text-center mb-4">
            Video Demo Fenix SGCN
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mb-6">
            Video recorrido por todas las funcionalidades del sistema de gestión de continuidad de negocio
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
            
            <div className="space-y-6">
              {/* Video Player */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-4">Video Demo Fenix SGCN</h3>
                <div className="aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    controls 
                    className="w-full h-full"
                    poster={demoThumbnail}
                  >
                    <source src={demoVideo} type="video/mp4" />
                    Tu navegador no soporta el elemento video.
                  </video>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Video demo completo del sistema Fenix SGCN
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
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VideoDemo;