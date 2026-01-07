
import React from 'react';
import { ArrowUpRight, ArrowDownLeft, Clock, DollarSign } from 'lucide-react';
import { Movement } from '../types';
import { Language, translations } from '../translations';

interface MovementLogProps {
  movements: Movement[];
  language: Language;
}

const MovementLog: React.FC<MovementLogProps> = ({ movements, language }) => {
  const t = translations[language];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { 
      style: 'currency', 
      currency: 'AOA',
      maximumFractionDigits: 0 
    }).format(value).replace('AOA', 'Kz');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-semibold text-slate-800">{t.history}</h3>
        <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
          {movements.length} {t.movements}
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
              <th className="px-6 py-4">{t.type}</th>
              <th className="px-6 py-4">{t.product}</th>
              <th className="px-6 py-4 text-center">{t.stock}</th>
              <th className="px-6 py-4 text-right">{t.unitPrice}</th>
              <th className="px-6 py-4 text-right">{t.totalMovement}</th>
              <th className="px-6 py-4">{t.date}</th>
              <th className="px-6 py-4">{t.reason}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {movements.length > 0 ? [...movements].reverse().map((m) => (
              <tr key={m.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-2 w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    m.type === 'in' ? 'bg-orange-50 text-orange-700' : 'bg-rose-50 text-rose-700'
                  }`}>
                    {m.type === 'in' ? <ArrowDownLeft className="w-3 h-3" /> : <ArrowUpRight className="w-3 h-3" />}
                    {m.type === 'in' ? t.in : t.out}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm font-semibold text-slate-900 block group-hover:text-orange-600 transition-colors">
                    {m.productName}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`text-sm font-bold ${
                    m.type === 'in' ? 'text-orange-600' : 'text-rose-600'
                  }`}>
                    {m.type === 'in' ? '+' : '-'}{m.quantity}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="text-xs text-slate-500 font-medium">
                    {formatCurrency(m.unitPrice || 0)}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className={`text-sm font-bold ${m.type === 'in' ? 'text-slate-900' : 'text-slate-700'}`}>
                      {formatCurrency(m.totalValue || 0)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-[10px] text-slate-500 font-medium">
                    <Clock className="w-3 h-3" />
                    {new Date(m.date).toLocaleString(language === 'en' ? 'en-US' : language === 'fr' ? 'fr-FR' : 'pt-BR')}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-500 italic max-w-[200px] truncate" title={m.reason}>
                    {m.reason}
                  </p>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-slate-50 rounded-full">
                      <DollarSign className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-400 text-sm font-medium">{t.emptyMovements}</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MovementLog;
