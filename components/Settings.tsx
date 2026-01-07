
import React from 'react';
import { Languages, Check } from 'lucide-react';
import { Language, translations } from '../translations';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const Settings: React.FC<SettingsProps> = ({ language, setLanguage }) => {
  const t = translations[language];

  const langs = [
    { id: 'pt', label: 'Português', sub: 'Portugal / Angola' },
    { id: 'en', label: 'English', sub: 'United Kingdom / US' },
    { id: 'fr', label: 'Français', sub: 'France / Canada' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-100 rounded-lg">
            <Languages className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{t.language}</h2>
            <p className="text-sm text-slate-500">{t.chooseLanguage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {langs.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setLanguage(lang.id as Language)}
              className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                language === lang.id
                  ? 'border-orange-600 bg-orange-50/50'
                  : 'border-slate-100 hover:border-slate-200 bg-white'
              }`}
            >
              <div className="text-left">
                <p className={`font-bold ${language === lang.id ? 'text-orange-900' : 'text-slate-700'}`}>
                  {lang.label}
                </p>
                <p className="text-xs text-slate-500">{lang.sub}</p>
              </div>
              {language === lang.id && (
                <div className="bg-orange-600 p-1 rounded-full">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-orange-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
        <div className="relative z-10">
          <h3 className="font-bold mb-2">PIXEL PRINT LDA</h3>
          <p className="text-sm text-orange-200 opacity-80">Sistema de Gestão de Inventário v2.0</p>
          <div className="mt-4 pt-4 border-t border-orange-800/50 flex justify-between items-center text-[10px] uppercase tracking-widest font-bold">
            <span>© 2024 Pixel Print</span>
            <span className="px-2 py-0.5 bg-orange-800 rounded">Angola</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
