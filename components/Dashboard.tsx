
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertCircle, DollarSign, Box } from 'lucide-react';
import { Product } from '../types';
import { Language, translations } from '../translations';

interface DashboardProps {
  products: Product[];
  language: Language;
}

const Dashboard: React.FC<DashboardProps> = ({ products, language }) => {
  const t = translations[language];

  const stats = React.useMemo(() => {
    const totalItems = products.reduce((acc, p) => acc + p.quantity, 0);
    const lowStockItems = products.filter(p => p.quantity <= p.minStock).length;
    const totalValue = products.reduce((acc, p) => acc + (p.price * p.quantity), 0);
    
    const categories: Record<string, number> = {};
    products.forEach(p => {
      categories[p.category] = (categories[p.category] || 0) + 1;
    });
    const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0]?.[0] || 'N/A';

    return { totalItems, lowStockItems, totalValue, topCategory };
  }, [products]);

  const chartData = React.useMemo(() => {
    return products.slice(0, 10).map(p => ({
      name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
      stock: p.quantity,
      min: p.minStock
    }));
  }, [products]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value).replace('AOA', 'Kz');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 rounded-lg">
              <Box className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">{t.totalItems}</p>
          <p className="text-2xl font-bold text-slate-900">{stats.totalItems}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <AlertCircle className="w-5 h-5 text-rose-600" />
            </div>
            {stats.lowStockItems > 0 && (
              <span className="text-xs font-medium bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                {t.critical}
              </span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-500">{t.lowStock}</p>
          <p className="text-2xl font-bold text-slate-900">{stats.lowStockItems}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <DollarSign className="w-5 h-5 text-orange-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">{t.stockValue}</p>
          <p className="text-2xl font-bold text-slate-900">
            {formatCurrency(stats.totalValue)}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-amber-600" />
            </div>
          </div>
          <p className="text-sm font-medium text-slate-500">{t.topCategory}</p>
          <p className="text-2xl font-bold text-slate-900">{stats.topCategory}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-slate-800">{t.stockLevels}</h3>
          <div className="flex gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-orange-500" /> {t.current}
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded bg-slate-300" /> {t.minimum}
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="stock" fill="#f97316" radius={[4, 4, 0, 0]} barSize={32} />
              <Bar dataKey="min" fill="#cbd5e1" radius={[4, 4, 0, 0]} barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
