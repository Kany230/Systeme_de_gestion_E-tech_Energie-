import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

export default function Settings() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>
        <p className="mt-2 text-gray-600">Configurez vos préférences système</p>
      </div>

      <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
        <SettingsIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Page Paramètres en construction</h3>
        <p className="text-gray-500">Cette fonctionnalité sera disponible prochainement.</p>
      </div>
    </div>
  );
}
