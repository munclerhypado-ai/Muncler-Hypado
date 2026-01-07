
import React, { useState, useMemo } from 'react';
import { X, ArrowDownLeft, ArrowUpRight, Package, Calculator, DollarSign } from 'lucide-react';
import { Product, MovementType } from '../types';
import { Language, translations } from '../translations';

interface MovementFormProps {
  products: Product[];
  language: Language;
  onSave: (productId: string, type: MovementType, quantity: number, reason: string) => void;
  onClose: () => void;
}

const MovementForm: React.FC<MovementFormProps> = ({ products, language, onSave, onClose }) => {
  const t = translations[language];
  const [selectedId, setSelectedId] = useState('');
  const [type, setType] = useState<MovementType>('in');
  const [qty, setQty] = useState<number>(1);
  const [reason, setReason] = useState('');

  const selectedProduct = useMemo(() => products.find(p => p.id === selectedId), [products, selectedId]);

  const totalOperationValue = useMemo(() => {
    if (!selectedProduct) return 0;
    return (qty || 0) * selectedProduct.price;
  }, [selectedProduct, qty]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { 
      style: 'currency', 
      currency: 'AOA',
      maximumFractionDigits: 0 
    }).format(value).replace('AOA', 'Kz');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || qty <= 0) return;
    onSave(selectedId, type, qty, reason);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-orange-600" />
            {t.registerMovement}
          </h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Produto Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.product}</label>
            <select
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm font-medium"
              value={selectedId}
              onChange={e => {
                setSelectedId(e.target.value);
                setQty(1); // Reset qty on product change
              }}
            >
              <option value="">{t.selectProduct}...</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku})</option>
              ))}
            </select>
          </div>

          {/* Product Info Cards */}
          {selectedProduct && (
            <div className="grid grid-cols-2 gap-3 animate-in slide-in-from-top-2">
              <div className="bg-orange-50 p-3 rounded-xl border border-orange-100">
                <p className="text-[10px] font-bold text-orange-600 uppercase mb-1">{t.stock}</p>
                <p className="text-xl font-black text-orange-700">{selectedProduct.quantity}</p>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">{t.unitPrice}</p>
                <p className="text-sm font-bold text-slate-900">{formatCurrency(selectedProduct.price)}</p>
              </div>
            </div>
          )}

          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setType('in')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                type === 'in' ? 'bg-orange-600 border-orange-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <ArrowDownLeft className="w-4 h-4" /> {t.in}
            </button>
            <button
              type="button"
              onClick={() => setType('out')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 transition-all font-bold text-sm ${
                type === 'out' ? 'bg-rose-600 border-rose-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
              }`}
            >
              <ArrowUpRight className="w-4 h-4" /> {t.out}
            </button>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.quantityToChange}</label>
            <div className="relative">
              <input
                required
                type="number"
                min="1"
                className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 font-bold text-lg"
                value={qty}
                onChange={e => setQty(parseInt(e.target.value) || 0)}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Calculator className="w-5 h-5" />
              </div>
            </div>
          </div>

          {/* Total Value Preview */}
          {selectedProduct && qty > 0 && (
            <div className={`p-4 rounded-xl border flex items-center justify-between transition-colors ${
              type === 'in' ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'
            }`}>
              <div className="flex items-center gap-2">
                <DollarSign className={`w-4 h-4 ${type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`} />
                <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{t.totalMovement}</span>
              </div>
              <span className={`text-lg font-black ${type === 'in' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {formatCurrency(totalOperationValue)}
              </span>
            </div>
          )}

          {/* Reason Input */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{t.reason}</label>
            <input
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500/20 text-sm"
              placeholder="Ex: Venda, Reposição, Ajuste..."
              value={reason}
              onChange={e => setReason(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              disabled={!selectedId || qty <= 0}
              className="flex-1 px-4 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-xl disabled:opacity-50 active:scale-95"
            >
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MovementForm;
