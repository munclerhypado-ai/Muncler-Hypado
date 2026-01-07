
import React from 'react';
import { X } from 'lucide-react';
import { Product } from '../types';
import { Language, translations } from '../translations';

interface InventoryFormProps {
  product?: Product | null;
  language: Language;
  onSave: (p: Partial<Product>) => void;
  onClose: () => void;
}

const InventoryForm: React.FC<InventoryFormProps> = ({ product, language, onSave, onClose }) => {
  const t = translations[language];
  const [formData, setFormData] = React.useState<Partial<Product>>(
    product || {
      name: '',
      category: '',
      sku: '',
      price: 0,
      quantity: 0,
      minStock: 5,
      description: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800">
            {product ? t.editProduct : t.newProduct}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.productName}</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.name}
                onChange={e => setFormData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.category}</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.category}
                onChange={e => setFormData(prev => ({...prev, category: e.target.value}))}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.sku}</label>
              <input 
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.sku}
                onChange={e => setFormData(prev => ({...prev, sku: e.target.value}))}
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.price}</label>
              <input 
                required
                type="number"
                step="0.01"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.price}
                onChange={e => setFormData(prev => ({...prev, price: parseFloat(e.target.value)}))}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.initialQty}</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.quantity}
                onChange={e => setFormData(prev => ({...prev, quantity: parseInt(e.target.value)}))}
              />
            </div>
            <div className="col-span-1">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.minStockLabel}</label>
              <input 
                required
                type="number"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                value={formData.minStock}
                onChange={e => setFormData(prev => ({...prev, minStock: parseInt(e.target.value)}))}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t.description}</label>
              <textarea 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 h-24 resize-none"
                value={formData.description}
                onChange={e => setFormData(prev => ({...prev, description: e.target.value}))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              {t.cancel}
            </button>
            <button 
              type="submit"
              className="flex-1 px-4 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-600/20"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
