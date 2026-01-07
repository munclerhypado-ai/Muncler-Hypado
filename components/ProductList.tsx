
import React from 'react';
import { Search, Plus, Edit2, Trash2, PackageOpen, MinusCircle, PlusCircle, Check, X as CloseIcon, ArrowRightLeft } from 'lucide-react';
import { Product } from '../types';
import { Language, translations } from '../translations';

interface ProductListProps {
  products: Product[];
  language: Language;
  onAddProduct: () => void;
  onEditProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onQuickUpdate: (id: string, amount: number) => void;
  onManualStockUpdate: (id: string, newTotal: number) => void;
  onPriceUpdate: (id: string, newPrice: number) => void;
  onRegisterMovement: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ 
  products, language, onAddProduct, onEditProduct, onDeleteProduct, 
  onQuickUpdate, onManualStockUpdate, onPriceUpdate, onRegisterMovement 
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('Todas');
  const [editingPriceId, setEditingPriceId] = React.useState<string | null>(null);
  const [editingStockId, setEditingStockId] = React.useState<string | null>(null);
  const [tempPrice, setTempPrice] = React.useState<string>('');
  const [tempStock, setTempStock] = React.useState<string>('');
  const t = translations[language];

  const categories = [t.allCategories, ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === t.allCategories || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', { style: 'currency', currency: 'AOA' }).format(value).replace('AOA', 'Kz');
  };

  const handleStartPriceEdit = (product: Product) => {
    setEditingPriceId(product.id);
    setTempPrice(product.price.toString());
  };

  const handleStartStockEdit = (product: Product) => {
    setEditingStockId(product.id);
    setTempStock(product.quantity.toString());
  };

  const handleSavePrice = (id: string) => {
    const newPrice = parseFloat(tempPrice);
    if (!isNaN(newPrice) && newPrice >= 0) {
      onPriceUpdate(id, newPrice);
    }
    setEditingPriceId(null);
  };

  const handleSaveStock = (id: string) => {
    const newTotal = parseInt(tempStock);
    if (!isNaN(newTotal) && newTotal >= 0) {
      onManualStockUpdate(id, newTotal);
    }
    setEditingStockId(null);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Search and Header Controls */}
      <div className="p-6 border-b border-slate-100 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between bg-slate-50/30">
        <div className="flex flex-col sm:flex-row gap-3 flex-1 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={onRegisterMovement}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <ArrowRightLeft className="w-4 h-4" /> {t.registerMovement}
          </button>
          <button 
            onClick={onAddProduct}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-semibold hover:bg-orange-700 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" /> {t.newProduct}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
              <th className="px-6 py-4">{t.product}</th>
              <th className="px-6 py-4">{t.category}</th>
              <th className="px-6 py-4 text-center">{t.sku}</th>
              <th className="px-6 py-4 text-center">{t.price}</th>
              <th className="px-6 py-4 text-center">{t.stock}</th>
              <th className="px-6 py-4 text-right">{t.actions}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProducts.length > 0 ? filteredProducts.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-500 transition-all shrink-0">
                      <PackageOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 leading-tight">{p.name}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-mono">{p.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-[10px] font-bold uppercase">
                    {p.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-center text-xs text-slate-500 font-mono">
                  {p.sku}
                </td>
                <td className="px-6 py-4 text-center">
                  {editingPriceId === p.id ? (
                    <div className="flex items-center justify-center gap-1">
                      <input
                        autoFocus
                        type="number"
                        className="w-24 px-2 py-1 bg-white border border-orange-500 rounded-lg text-sm focus:outline-none"
                        value={tempPrice}
                        onChange={(e) => setTempPrice(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSavePrice(p.id);
                          if (e.key === 'Escape') setEditingPriceId(null);
                        }}
                      />
                      <button onClick={() => handleSavePrice(p.id)} className="p-1 text-green-600 hover:bg-green-50 rounded">
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="flex flex-col cursor-pointer hover:scale-105 transition-transform"
                      onClick={() => handleStartPriceEdit(p)}
                    >
                      <span className="text-sm font-bold text-slate-900">{formatCurrency(p.price)}</span>
                      <button className="text-[10px] text-orange-600 font-bold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                        {t.changeValue}
                      </button>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => onQuickUpdate(p.id, -1)}
                        className="text-slate-400 hover:text-rose-500 transition-colors"
                        title={t.remove}
                      >
                        <MinusCircle className="w-5 h-5" />
                      </button>
                      
                      {editingStockId === p.id ? (
                        <input
                          autoFocus
                          type="number"
                          className="w-16 px-1 py-0.5 bg-white border border-orange-500 rounded text-center text-sm font-bold focus:outline-none"
                          value={tempStock}
                          onChange={(e) => setTempStock(e.target.value)}
                          onBlur={() => handleSaveStock(p.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveStock(p.id);
                            if (e.key === 'Escape') setEditingStockId(null);
                          }}
                        />
                      ) : (
                        <span 
                          onClick={() => handleStartStockEdit(p)}
                          className={`text-base font-bold min-w-[3ch] text-center cursor-pointer hover:text-orange-600 transition-colors ${
                            p.quantity <= p.minStock ? 'text-rose-600' : 'text-slate-900'
                          }`}
                        >
                          {p.quantity}
                        </span>
                      )}

                      <button 
                        onClick={() => onQuickUpdate(p.id, 1)}
                        className="text-slate-400 hover:text-orange-500 transition-colors"
                        title={t.add}
                      >
                        <PlusCircle className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full transition-all ${
                          p.quantity <= p.minStock ? 'bg-rose-500' : 'bg-orange-500'
                        }`}
                        style={{ width: `${Math.min((p.quantity / (p.minStock * 2)) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button 
                      onClick={() => onEditProduct(p)}
                      className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all"
                      title={t.editProduct}
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteProduct(p.id)}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                      title={t.remove}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <PackageOpen className="w-12 h-12 text-slate-300" />
                    <p className="text-slate-500 font-medium">{t.emptyProducts}</p>
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

export default ProductList;
