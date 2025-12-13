import React from 'react';
import { Button, EmptyState, IconBox } from '@/components';

const Pickup: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background dark:bg-dark-bg p-6 overflow-y-auto pb-safe-bottom">
      <h1 className="text-2xl font-extrabold text-text dark:text-dark-text mb-6">Retiros</h1>

      {/* Request Pickup Card */}
      {/* Request Pickup Card */}
      <div className="bg-surface dark:bg-dark-surface rounded-[32px] p-6 shadow-lg border border-gray-100 dark:border-dark-border mb-8 relative overflow-hidden shrink-0">
        <div className="relative z-10 flex flex-col items-start gap-4">
          <IconBox
            icon="local_shipping"
            size="lg"
            className="bg-[#D0EBE8] text-primary dark:bg-primary/20 dark:text-accent"
          />

          <div>
            <h2 className="text-2xl font-bold mb-2 text-text dark:text-dark-text">Retiro a Domicilio</h2>
            <p className="text-text-secondary dark:text-dark-text-secondary text-sm leading-relaxed max-w-[90%]">
              Programa un retiro de tus residuos reciclables directamente en tu hogar.
            </p>
          </div>

          <div className="w-full pt-2 shrink-0">
            <Button
              fullWidth
              className="bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-500 font-medium border-0 cursor-not-allowed hover:bg-gray-100 dark:hover:bg-white/5"
              disabled
            >
              Próximamente
            </Button>
          </div>
        </div>
      </div>

      <h3 className="font-bold text-gray-500 dark:text-gray-400 text-sm mb-4 uppercase tracking-wide">Tus Retiros</h3>

      <EmptyState
        icon="package_2"
        title="No tienes retiros pendientes"
        description="Tus solicitudes de retiro aparecerán aquí."
        className="py-8"
      />

      <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-100 dark:border-orange-900/30 flex gap-3">
        <span className="material-symbols-rounded text-orange-500 shrink-0">info</span>
        <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
          El servicio de retiro está disponible solo en algunas comunas. Revisa la cobertura en tu perfil.
        </p>
      </div>
    </div>
  );
};

export default Pickup;