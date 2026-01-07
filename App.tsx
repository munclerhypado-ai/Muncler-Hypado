
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ProductList from './components/ProductList';
import MovementLog from './components/MovementLog';
import InventoryForm from './components/InventoryForm';
import MovementForm from './components/MovementForm';
import Settings from './components/Settings';
import { Product, Movement, MovementType } from './types';
import { Language, translations } from './translations';

const INITIAL_PRODUCTS: Product[] = [
  { id: '1', name: 'Folhas de Formato A4 (Resma 500 fls)', sku: 'PAP-001', category: 'Papelaria', price: 4500, quantity: 40, minStock: 10, description: 'Papel sulfite A4 branco de alta qualidade para impressões.', lastUpdated: new Date().toISOString() },
  { id: '2', name: 'Cabo USB Tipo-C (1.5m)', sku: 'CAB-001', category: 'Acessórios', price: 2500, quantity: 25, minStock: 5, description: 'Cabo de carregamento rápido e dados Tipo-C.', lastUpdated: new Date().toISOString() },
  { id: '3', name: 'Cabo USB V8 (Micro USB)', sku: 'CAB-002', category: 'Acessórios', price: 1800, quantity: 15, minStock: 5, description: 'Cabo USB padrão para dispositivos Android antigos.', lastUpdated: new Date().toISOString() },
  { id: '4', name: 'Cartucho de Tinta Preto 667', sku: 'SUP-001', category: 'Suprimentos', price: 12500, quantity: 8, minStock: 3, description: 'Cartucho original para impressoras HP.', lastUpdated: new Date().toISOString() },
  { id: '5', name: 'Pen Drive 32GB Kingston', sku: 'STO-001', category: 'Armazenamento', price: 5500, quantity: 12, minStock: 4, description: 'Dispositivo de armazenamento USB 3.0.', lastUpdated: new Date().toISOString() },
  { id: '6', name: 'Serviço de Impressão (PB)', sku: 'SERV-001', category: 'Serviços', price: 100, quantity: 5000, minStock: 100, description: 'Custo por folha impressa em preto e branco.', lastUpdated: new Date().toISOString() },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('pixel_lang') as Language) || 'pt';
  });
  
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('invsmart_products');
    return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
  });
  
  const [movements, setMovements] = useState<Movement[]>(() => {
    const saved = localStorage.getItem('invsmart_movements');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem('invsmart_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('invsmart_movements', JSON.stringify(movements));
  }, [movements]);

  useEffect(() => {
    localStorage.setItem('pixel_lang', language);
  }, [language]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setIsProductModalOpen(true);
  };

  const handleEditProduct = (p: Product) => {
    setEditingProduct(p);
    setIsProductModalOpen(true);
  };

  const handleDeleteProduct = (id: string) => {
    if (confirm(t.confirmDelete)) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleManualStockUpdate = (productId: string, newTotal: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        if (newTotal === p.quantity) return p;
        const diff = newTotal - p.quantity;
        
        const newMovement: Movement = {
          id: Math.random().toString(36).substr(2, 9),
          productId: p.id,
          productName: p.name,
          type: diff > 0 ? 'in' : 'out',
          quantity: Math.abs(diff),
          unitPrice: p.price,
          totalValue: Math.abs(diff) * p.price,
          date: new Date().toISOString(),
          reason: t.manualAdjust
        };
        setMovements(m => [...m, newMovement]);
        return { ...p, quantity: newTotal, lastUpdated: new Date().toISOString() };
      }
      return p;
    }));
  };

  const handleQuickStockUpdate = (productId: string, amount: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const newQty = Math.max(0, p.quantity + amount);
        if (newQty === p.quantity) return p;

        const newMovement: Movement = {
          id: Math.random().toString(36).substr(2, 9),
          productId: p.id,
          productName: p.name,
          type: amount > 0 ? 'in' : 'out',
          quantity: Math.abs(amount),
          unitPrice: p.price,
          totalValue: Math.abs(amount) * p.price,
          date: new Date().toISOString(),
          reason: t.quickAdjust
        };
        setMovements(m => [...m, newMovement]);
        
        return { ...p, quantity: newQty, lastUpdated: new Date().toISOString() };
      }
      return p;
    }));
  };

  const handlePriceUpdate = (productId: string, newPrice: number) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, price: newPrice, lastUpdated: new Date().toISOString() } : p
    ));
  };

  const handleSaveMovement = (productId: string, type: MovementType, qty: number, reason: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        const finalQty = type === 'in' ? p.quantity + qty : Math.max(0, p.quantity - qty);
        
        const newMovement: Movement = {
          id: Math.random().toString(36).substr(2, 9),
          productId: p.id,
          productName: p.name,
          type: type,
          quantity: qty,
          unitPrice: p.price,
          totalValue: qty * p.price,
          date: new Date().toISOString(),
          reason: reason || (type === 'in' ? t.in : t.out)
        };
        setMovements(m => [...m, newMovement]);
        return { ...p, quantity: finalQty, lastUpdated: new Date().toISOString() };
      }
      return p;
    }));
    setIsMovementModalOpen(false);
  };

  const handleSaveProduct = (formData: Partial<Product>) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...formData, lastUpdated: new Date().toISOString() } as Product : p));
      
      if (formData.quantity !== undefined && formData.quantity !== editingProduct.quantity) {
        const diff = formData.quantity - editingProduct.quantity;
        const currentPrice = formData.price ?? editingProduct.price;
        const newMovement: Movement = {
          id: Math.random().toString(36).substr(2, 9),
          productId: editingProduct.id,
          productName: editingProduct.name,
          type: diff > 0 ? 'in' : 'out',
          quantity: Math.abs(diff),
          unitPrice: currentPrice,
          totalValue: Math.abs(diff) * currentPrice,
          date: new Date().toISOString(),
          reason: t.manualAdjust
        };
        setMovements(prev => [...prev, newMovement]);
      }
    } else {
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        ...formData,
        lastUpdated: new Date().toISOString(),
      } as Product;
      setProducts(prev => [...prev, newProduct]);
      
      const newMovement: Movement = {
        id: Math.random().toString(36).substr(2, 9),
        productId: newProduct.id,
        productName: newProduct.name,
        type: 'in',
        quantity: newProduct.quantity,
        unitPrice: newProduct.price,
        totalValue: newProduct.quantity * newProduct.price,
        date: new Date().toISOString(),
        reason: t.initialStock
      };
      setMovements(prev => [...prev, newMovement]);
    }
    setIsProductModalOpen(false);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard products={products} language={language} />;
      case 'products':
        return (
          <ProductList 
            products={products} 
            language={language}
            onAddProduct={handleAddProduct}
            onEditProduct={handleEditProduct}
            onDeleteProduct={handleDeleteProduct}
            onQuickUpdate={handleQuickStockUpdate}
            onManualStockUpdate={handleManualStockUpdate}
            onPriceUpdate={handlePriceUpdate}
            onRegisterMovement={() => setIsMovementModalOpen(true)}
          />
        );
      case 'movements':
        return <MovementLog movements={movements} language={language} />;
      case 'settings':
        return <Settings language={language} setLanguage={setLanguage} />;
      default:
        return null;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} language={language}>
      {renderContent()}
      
      {isProductModalOpen && (
        <InventoryForm 
          product={editingProduct}
          language={language}
          onSave={handleSaveProduct}
          onClose={() => setIsProductModalOpen(false)}
        />
      )}

      {isMovementModalOpen && (
        <MovementForm
          products={products}
          language={language}
          onSave={handleSaveMovement}
          onClose={() => setIsMovementModalOpen(false)}
        />
      )}
    </Layout>
  );
};

export default App;
