import React from 'react';

const Pickup: React.FC = () => {
  return (
    <div className="h-full flex flex-col bg-background dark:bg-dark-bg transition-colors duration-300">
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <h1 className="text-2xl font-bold text-text dark:text-dark-text mb-6">Programar Retiro</h1>
        
        <div className="bg-white dark:bg-dark-surface rounded-[32px] p-6 shadow-sm mb-6 border border-gray-100 dark:border-dark-border transition-colors">
          <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-secondary/30 dark:bg-primary/20 rounded-full flex items-center justify-center text-primary-dark dark:text-primary">
                  <span className="material-symbols-rounded filled-icon">local_shipping</span>
              </div>
              <div>
                  <h3 className="font-bold text-text dark:text-dark-text">Retiro a Domicilio</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Disponible para cargas grandes (+5kg)</p>
              </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-6 leading-relaxed">
              Agenda el retiro de tus residuos electrónicos directamente en tu hogar. Nuestros recicladores certificados pasarán por tu dirección.
          </p>
          <button 
            disabled
            className="w-full bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 py-4 rounded-full font-bold text-sm shadow-none flex items-center justify-center gap-2 cursor-not-allowed opacity-80"
          >
              No disponible
          </button>
        </div>

        <h2 className="font-bold text-text dark:text-dark-text mb-4">Próximos Retiros</h2>
        
        {/* Empty State */}
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-300 dark:text-gray-600 mb-4">
                <span className="material-symbols-rounded text-4xl">calendar_month</span>
            </div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">No tienes retiros pendientes</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Tus retiros programados aparecerán aquí</p>
        </div>

        <div className="bg-secondary/20 dark:bg-primary/10 rounded-2xl p-4 flex gap-3 items-start mt-4">
            <span className="material-symbols-rounded text-primary-dark dark:text-primary">schedule</span>
            <div>
                <h4 className="text-sm font-bold text-primary-dark dark:text-primary">Horario de Atención</h4>
                <p className="text-xs text-primary-dark/80 dark:text-primary/80 mt-1">Lunes a Viernes de 9:00 a 18:00 hrs.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Pickup;