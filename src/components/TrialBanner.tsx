import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Crown, Clock, AlertTriangle } from 'lucide-react';
import { useTrialStatus } from '@/hooks/useTrialStatus';

const TrialBanner = () => {
  const { isActive, daysRemaining, planType, loading, extendTrial } = useTrialStatus();

  if (loading || planType !== 'trial') return null;

  if (!isActive) {
    return (
      <Alert className="border-destructive bg-destructive/10 mb-6">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-destructive font-medium">
            Tu prueba profesional ha expirado. Actualiza tu plan para continuar.
          </span>
          <Button variant="destructive" size="sm">
            Actualizar Plan
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (daysRemaining <= 5) {
    return (
      <Alert className="border-warning bg-warning/10 mb-6">
        <Clock className="h-4 w-4 text-warning" />
        <AlertDescription className="flex items-center justify-between">
          <span className="text-warning font-medium">
            ⚠️ Te quedan {daysRemaining} días de prueba profesional
          </span>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={extendTrial}>
              Extender Prueba
            </Button>
            <Button variant="default" size="sm">
              Comprar Plan
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert className="border-primary bg-primary/10 mb-6">
      <Crown className="h-4 w-4 text-primary" />
      <AlertDescription className="flex items-center justify-between">
        <span className="text-primary font-medium">
          ✨ Plan Profesional (Prueba) - {daysRemaining} días restantes
        </span>
        <Button variant="outline" size="sm">
          Ver Planes
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default TrialBanner;