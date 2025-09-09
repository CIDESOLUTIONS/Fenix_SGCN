import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

interface TrialStatus {
  isActive: boolean;
  daysRemaining: number;
  planType: string;
  trialEnd: Date | null;
  loading: boolean;
}

export const useTrialStatus = () => {
  const { user } = useAuth();
  const [trialStatus, setTrialStatus] = useState<TrialStatus>({
    isActive: false,
    daysRemaining: 0,
    planType: 'trial',
    trialEnd: null,
    loading: true
  });

  useEffect(() => {
    if (!user) {
      setTrialStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    const fetchTrialStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching trial status:', error);
          return;
        }

        if (data) {
          const trialEnd = new Date(data.trial_end);
          const now = new Date();
          const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
          const isActive = data.is_active && daysRemaining > 0;

          setTrialStatus({
            isActive,
            daysRemaining: Math.max(0, daysRemaining),
            planType: data.plan_type,
            trialEnd,
            loading: false
          });

          // Show warning if 5 days or less remaining and not already notified
          if (daysRemaining <= 5 && daysRemaining > 0 && !data.notified_5_days) {
            toast({
              title: "⚠️ Prueba gratuita por vencer",
              description: `Te quedan ${daysRemaining} días de prueba profesional. ¿Quieres conservar tu información o empezar de cero?`,
              duration: 10000,
            });

            // Mark as notified
            await supabase
              .from('user_subscriptions')
              .update({ notified_5_days: true })
              .eq('id', data.id);
          }
        } else {
          setTrialStatus(prev => ({ ...prev, loading: false }));
        }
      } catch (error) {
        console.error('Error in fetchTrialStatus:', error);
        setTrialStatus(prev => ({ ...prev, loading: false }));
      }
    };

    fetchTrialStatus();
  }, [user]);

  const extendTrial = async () => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          trial_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          notified_5_days: false,
          is_active: true
        })
        .eq('user_id', user.id);

      if (error) throw error;

      toast({
        title: "✅ Prueba extendida",
        description: "Tu prueba profesional ha sido extendida por 30 días más.",
      });

      // Refresh status
      window.location.reload();
    } catch (error) {
      console.error('Error extending trial:', error);
      toast({
        title: "Error",
        description: "No se pudo extender la prueba. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  return { ...trialStatus, extendTrial };
};