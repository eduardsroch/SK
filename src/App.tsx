/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  ShoppingBag, 
  Plus, 
  Minus, 
  X, 
  MessageCircle, 
  MapPin, 
  Clock, 
  Search,
  ChevronLeft,
  Beef,
  Utensils,
  CupSoda,
  Info,
  Trash2,
  Check,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

interface Addon {
  id: string;
  name: string;
  price: number;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'burgers' | 'portions' | 'drinks';
  icon?: string;
}

interface CartItem {
  cartId: string;
  product: Product;
  quantity: number;
  selectedAddons: Addon[];
}

// --- Constants ---

const COMPANY_INFO = {
  name: "Skina33",
  slogan: "Artesanal, suculento e irresistível!",
  phone: "73981260962",
  address: "Caminho 33, Hernani Sá - Ilhéus Bahia",
  hours: "Segunda a domingo • 18:00 - 23:30",
  whatsappUrl: "https://wa.me/5573981260962",
  deliveryTime: "30-45 min",
  logo: "https://storage.googleapis.com/birdview-external-production/67dd988675402422071060/67dd988675402422071060_0.png"
};

const BURGERS: Product[] = [
  { id: 'b1', name: 'Skina cheddar cremoso', category: 'burgers', price: 19.99, description: 'Pão batata, Hambúrguer artesanal 130g, Cheddar cremoso, Bacon, Cebola caramelizada', icon: 'Beef' },
  { id: 'b2', name: 'Skina burguer', category: 'burgers', price: 18.99, description: 'Pão batata, Hambúrguer artesanal 130g, Queijo, Presunto, Molho especial 33, Salada, Batata palha', icon: 'Beef' },
  { id: 'b3', name: 'Skina bacon', category: 'burgers', price: 26.99, description: 'Pão batata, Hambúrguer artesanal 130g, Bacon, Queijo, Presunto, Molho especial 33, Salada, Batata palha, Cebola caramelizada', icon: 'Beef' },
  { id: 'b4', name: 'Skina egg bacon', category: 'burgers', price: 27.99, description: 'Pão batata, Hambúrguer artesanal 130g, Bacon, Queijo, Presunto, Ovo, Molho especial 33, Salada, Cebola caramelizada, Batata palha', icon: 'Beef' },
  { id: 'b5', name: 'Skina sertão', category: 'burgers', price: 31.99, description: 'Pão batata, Hambúrguer artesanal 130g, Queijo coalho, Melaço de cana, Bacon, Banana frita', icon: 'Beef' },
  { id: 'b6', name: 'Skina cream cheese', category: 'burgers', price: 29.99, description: 'Pão batata, Hambúrguer artesanal 130g, Cream cheese, Cebola caramelizada, Bacon', icon: 'Beef' },
  { id: 'b7', name: 'Skina 04 queijos', category: 'burgers', price: 33.99, description: 'Pão batata, Hambúrguer artesanal 130g, Gorgonzola, Mussarela, Requeijão cremoso, Catupiry, Bacon, Molho especial, Salada', icon: 'Beef' },
  { id: 'b8', name: 'Skina frango', category: 'burgers', price: 22.99, description: 'Pão batata, Frango desfiado, Queijo mussarela, Bacon, Salada', icon: 'Beef' },
  { id: 'b9', name: 'Skina tropical burguer', category: 'burgers', price: 27.99, description: 'Pão batata, Hambúrguer artesanal 130g, Requeijão cremoso, Bacon, Abacaxi, Salada, Molho especial', icon: 'Beef' },
  { id: 'b10', name: 'Skina calabresa', category: 'burgers', price: 25.99, description: 'Pão batata, Hambúrguer artesanal, Mussarela, Calabresa, Ovo, Molho especial 33, Salada, Batata palha, Cebola caramelizada', icon: 'Beef' },
];

const ADDONS: Addon[] = [
  { id: 'a1', name: 'Hambúrguer artesanal', price: 6.99 },
  { id: 'a2', name: 'Mussarela', price: 3.00 },
  { id: 'a3', name: 'Presunto', price: 2.00 },
  { id: 'a4', name: 'Bacon', price: 4.99 },
  { id: 'a5', name: 'Calabresa', price: 4.99 },
  { id: 'a6', name: 'Gorgonzola', price: 8.00 },
  { id: 'a7', name: 'Ovo', price: 1.50 },
  { id: 'a8', name: 'Requeijão cremoso', price: 3.00 },
  { id: 'a9', name: 'Catupiry', price: 3.00 },
  { id: 'a10', name: 'Cheddar', price: 3.00 },
  { id: 'a11', name: 'Cream cheese', price: 5.00 },
  { id: 'a12', name: 'Frango', price: 5.99 },
  { id: 'a13', name: 'Batata palha', price: 2.00 },
];

const PORTIONS: Product[] = [
  { id: 'p1', name: 'Batata frita', category: 'portions', price: 19.99, description: 'Porção crocante de batata frita', icon: 'Utensils' },
  { id: 'p2', name: 'Batata frita com cheddar + bacon', category: 'portions', price: 24.99, description: 'Porção de batata frita coberta com cheddar cremoso e bacon crocante', icon: 'Utensils' },
];

const DRINKS: Product[] = [
  { id: 'd1', name: 'Suco 500ml (sabores)', category: 'drinks', price: 10.00, description: 'Suco natural de diversos sabores', icon: 'CupSoda' },
  { id: 'd2', name: 'Refrigerante lata', category: 'drinks', price: 6.00, description: 'Lata 350ml', icon: 'CupSoda' },
  { id: 'd3', name: 'Refrigerante 1 litro Guaraná', category: 'drinks', price: 9.00, description: 'Garrafa 1L', icon: 'CupSoda' },
  { id: 'd4', name: 'Refrigerante 1 litro Coca cola', category: 'drinks', price: 10.00, description: 'Garrafa 1L', icon: 'CupSoda' },
];

const DELIVERY_LOCATIONS = [
  { name: "Urbis", fee: 3.00 },
  { name: "Nelson Costa", fee: 5.00 },
  { name: "Barreira", fee: 5.00 },
  { name: "Ilhéus II", fee: 6.00 },
  { name: "Nsv.", fee: 7.00 },
  { name: "Pontal", fee: 6.00 },
  { name: "Centro", fee: 10.00 },
  { name: "Conquista até a proximidades da praça Santa Rita", fee: 10.00 },
  { name: "Conquista depois da praça", fee: 12.00 },
  { name: "Malhado", fee: 15.00 },
  { name: "Barra", fee: 17.00 },
  { name: "Vilela", fee: 25.00 },
  { name: "Avenida princesa Isabel começo", fee: 10.00 },
  { name: "Avenida princesa Isabel mais pra frente", fee: 12.00 },
  { name: "Avenida Itabuna", fee: 12.00 },
  { name: "Avenida esperança", fee: 14.00 },
];

// --- Components ---

const ProductIcon = ({ name, size = 24, className = "" }: { name?: string, size?: number, className?: string }) => {
  if (name === 'Beef') return <Beef size={size} className={className} />;
  if (name === 'Utensils') return <Utensils size={size} className={className} />;
  if (name === 'CupSoda') return <CupSoda size={size} className={className} />;
  return (
    <img 
      src={COMPANY_INFO.logo} 
      alt="Product Icon" 
      style={{ width: size, height: size }} 
      className={`object-contain ${className}`}
      referrerPolicy="no-referrer"
    />
  );
};

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProductForAddons, setSelectedProductForAddons] = useState<Product | null>(null);
  const [tempAddons, setTempAddons] = useState<Addon[]>([]);
  const [tempQuantity, setTempQuantity] = useState(1);
  const [activeCategory, setActiveCategory] = useState<'burgers' | 'portions' | 'drinks'>('burgers');
  const [searchQuery, setSearchQuery] = useState('');

  const burgerRef = useRef<HTMLDivElement>(null);
  const portionRef = useRef<HTMLDivElement>(null);
  const drinkRef = useRef<HTMLDivElement>(null);

  // Checkout state
  const [paymentMethod, setPaymentMethod] = useState<'Pix' | 'Dinheiro' | 'Cartão'>('Pix');
  const [changeFor, setChangeFor] = useState('');
  const [address, setAddress] = useState('');
  const [observations, setObservations] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<typeof DELIVERY_LOCATIONS[0] | null>(null);

  // Persist cart
  useEffect(() => {
    const savedCart = localStorage.getItem('skina33_cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('skina33_cart', JSON.stringify(cart));
  }, [cart]);

  const cartTotal = useMemo(() => {
    const subtotal = cart.reduce((total, item) => {
      const addonsTotal = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
      return total + (item.product.price + addonsTotal) * item.quantity;
    }, 0);
    return subtotal + (selectedLocation?.fee || 0);
  }, [cart, selectedLocation]);

  const subtotal = useMemo(() => {
    return cart.reduce((total, item) => {
      const addonsTotal = item.selectedAddons.reduce((sum, a) => sum + a.price, 0);
      return total + (item.product.price + addonsTotal) * item.quantity;
    }, 0);
  }, [cart]);

  const addToCart = (product: Product, addons: Addon[] = [], quantity: number = 1) => {
    const cartId = `${product.id}-${addons.map(a => a.id).sort().join('-')}`;
    const existingIndex = cart.findIndex(item => item.cartId === cartId);

    if (existingIndex > -1) {
      const newCart = [...cart];
      newCart[existingIndex].quantity += quantity;
      setCart(newCart);
    } else {
      setCart([...cart, { cartId, product, quantity, selectedAddons: addons }]);
    }
    
    setSelectedProductForAddons(null);
    setTempAddons([]);
    setTempQuantity(1);
  };

  const removeFromCart = (cartId: string) => {
    setCart(cart.filter(item => item.cartId !== cartId));
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(cart.map(item => {
      if (item.cartId === cartId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleProductClick = (product: Product) => {
    setSelectedProductForAddons(product);
    setTempAddons([]);
    setTempQuantity(1);
  };

  const toggleAddon = (addon: Addon) => {
    if (tempAddons.find(a => a.id === addon.id)) {
      setTempAddons(tempAddons.filter(a => a.id !== addon.id));
    } else {
      setTempAddons([...tempAddons, addon]);
    }
  };

  const scrollToCategory = (cat: 'burgers' | 'portions' | 'drinks') => {
    setActiveCategory(cat);
    const refs = { burgers: burgerRef, portions: portionRef, drinks: drinkRef };
    refs[cat].current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const checkout = () => {
    if (!address) {
      alert("Por favor, preencha o endereço de entrega.");
      return;
    }

    if (!selectedLocation) {
      alert("Por favor, selecione a localidade para entrega.");
      return;
    }

    let message = `*Pedido Skina33*\n\n`;
    message += `*Itens:*\n`;
    cart.forEach(item => {
      message += `• ${item.product.name} x ${item.quantity} (R$ ${item.product.price.toFixed(2)})\n`;
      if (item.selectedAddons.length > 0) {
        message += `  _Adicionais: ${item.selectedAddons.map(a => a.name).join(', ')}_\n`;
      }
    });

    message += `\n*Subtotal: R$ ${subtotal.toFixed(2)}*\n`;
    message += `*Taxa de entrega (${selectedLocation.name}): R$ ${selectedLocation.fee.toFixed(2)}*\n`;
    message += `*Total: R$ ${cartTotal.toFixed(2)}*\n\n`;
    message += `*Forma de pagamento:* ${paymentMethod}\n`;
    if (paymentMethod === 'Dinheiro' && changeFor) {
      message += `*Troco para:* R$ ${changeFor}\n`;
    }
    message += `*Localidade:* ${selectedLocation.name}\n`;
    message += `*Endereço de entrega:* ${address}\n`;
    if (observations) {
      message += `*Observações:* ${observations}\n`;
    }

    const encodedMessage = encodeURIComponent(message);
    window.open(`${COMPANY_INFO.whatsappUrl}?text=${encodedMessage}`, '_blank');
  };

  const filteredBurgers = BURGERS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredPortions = PORTIONS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDrinks = DRINKS.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-white text-zinc-900 font-sans pb-32">
      {/* Header / Store Info */}
      <header className="relative">
        <div className="h-32 bg-red-600 flex items-center justify-center overflow-hidden">
          <img 
            src={COMPANY_INFO.logo} 
            alt="Skina33 Background" 
            className="w-full h-full object-cover opacity-30 blur-sm scale-110"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="max-w-3xl mx-auto px-4 -mt-12 relative z-10">
          <div className="bg-white rounded-xl shadow-md p-5 flex flex-col items-center text-center border border-zinc-100">
            <div className="w-24 h-24 bg-white rounded-full border-4 border-white -mt-16 shadow-lg flex items-center justify-center overflow-hidden">
              <img 
                src={COMPANY_INFO.logo} 
                alt={COMPANY_INFO.name} 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            <h1 className="text-2xl font-bold mt-3">{COMPANY_INFO.name}</h1>
            <p className="text-zinc-500 text-sm">{COMPANY_INFO.slogan}</p>
            
            <div className="flex items-center gap-4 mt-4 text-xs font-semibold text-zinc-600">
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-red-600" />
                <span>{COMPANY_INFO.deliveryTime}</span>
              </div>
              <div className="w-1 h-1 bg-zinc-300 rounded-full"></div>
              <div className="flex items-center gap-1">
                <MapPin size={14} className="text-red-600" />
                <span>Ilhéus - BA</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-3xl mx-auto px-4 mt-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar no cardápio"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-100 border-none rounded-xl py-3 pl-12 pr-4 text-sm focus:ring-2 focus:ring-red-500 outline-none"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="sticky top-0 bg-white z-30 border-b border-zinc-100 mt-4 overflow-x-auto no-scrollbar">
        <div className="max-w-3xl mx-auto px-4 flex gap-8">
          {(['burgers', 'portions', 'drinks'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => scrollToCategory(cat)}
              className={`py-4 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
                activeCategory === cat ? 'border-red-600 text-red-600' : 'border-transparent text-zinc-500'
              }`}
            >
              {cat === 'burgers' ? 'Hambúrgueres' : cat === 'portions' ? 'Porções' : 'Bebidas'}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Content */}
      <main className="max-w-3xl mx-auto px-4 mt-6 space-y-10">
        {/* Burgers */}
        <section ref={burgerRef} className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Hambúrgueres</h2>
          <div className="grid gap-px bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {filteredBurgers.map(product => (
              <ProductItem key={product.id} product={product} onClick={() => handleProductClick(product)} />
            ))}
          </div>
        </section>

        {/* Portions */}
        <section ref={portionRef} className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Porções</h2>
          <div className="grid gap-px bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {filteredPortions.map(product => (
              <ProductItem key={product.id} product={product} onClick={() => handleProductClick(product)} />
            ))}
          </div>
        </section>

        {/* Drinks */}
        <section ref={drinkRef} className="scroll-mt-24">
          <h2 className="text-xl font-bold mb-4">Bebidas</h2>
          <div className="grid gap-px bg-zinc-100 border border-zinc-100 rounded-xl overflow-hidden">
            {filteredDrinks.map(product => (
              <ProductItem key={product.id} product={product} onClick={() => handleProductClick(product)} />
            ))}
          </div>
        </section>
      </main>

      {/* Footer Info */}
      <footer className="max-w-3xl mx-auto px-4 mt-12 pb-12 text-center text-zinc-400 text-xs space-y-2">
        <p>{COMPANY_INFO.name} • {COMPANY_INFO.address}</p>
        <p>Desenvolvido com carinho para você.</p>
      </footer>

      {/* Bottom Cart Bar */}
      <AnimatePresence>
        <motion.div
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          exit={{ y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-100 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]"
        >
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-xs text-zinc-500 font-medium">Total do pedido</span>
              <span className="text-lg font-bold text-zinc-900">R$ {cartTotal.toFixed(2)}</span>
            </div>
              <button
                onClick={() => setIsCartOpen(true)}
                className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-colors active:scale-95"
              >
                <motion.div
                  key={`cart-icon-${cart.reduce((sum, i) => sum + i.quantity, 0)}`}
                  initial={{ scale: 1 }}
                  animate={{ 
                    scale: [1, 1.25, 1],
                    rotate: [0, -10, 10, 0]
                  }}
                  transition={{ 
                    duration: 0.4,
                    times: [0, 0.2, 0.5, 0.8, 1],
                    ease: "easeInOut"
                  }}
                >
                  <ShoppingBag size={20} />
                </motion.div>
                Ver sacola
                <motion.span
                  key={`cart-badge-${cart.reduce((sum, i) => sum + i.quantity, 0)}`}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 15 }}
                  className="bg-white/20 px-2 py-0.5 rounded text-xs"
                >
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </motion.span>
              </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Addons Modal (iFood Style) */}
      <AnimatePresence>
        {selectedProductForAddons && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProductForAddons(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative bg-white w-full max-w-2xl rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col max-h-[95vh]"
            >
              <div className="sticky top-0 bg-white z-10 p-4 border-b border-zinc-100 flex justify-between items-center">
                <h3 className="text-lg font-bold">Detalhes do item</h3>
                <button onClick={() => setSelectedProductForAddons(null)} className="p-2 text-zinc-400 hover:text-zinc-600">
                  <X size={24} />
                </button>
              </div>

              <div className="overflow-y-auto flex-1">
                <div className="h-48 bg-red-50 relative flex items-center justify-center">
                  <ProductIcon name={selectedProductForAddons.icon} size={80} className="text-red-600 opacity-20" />
                </div>
                
                <div className="p-6 space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedProductForAddons.name}</h2>
                    <p className="text-zinc-500 mt-2 text-sm leading-relaxed">{selectedProductForAddons.description}</p>
                    <p className="text-red-600 font-bold text-xl mt-3">R$ {selectedProductForAddons.price.toFixed(2)}</p>
                  </div>

                  {selectedProductForAddons.category === 'burgers' && (
                    <div className="space-y-4">
                      <div className="bg-zinc-50 p-3 rounded-lg flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-700 uppercase tracking-wider">Adicionais</span>
                        <span className="text-[10px] bg-zinc-200 text-zinc-600 px-2 py-1 rounded font-bold uppercase">Opcional</span>
                      </div>
                      
                      <div className="space-y-3">
                        {ADDONS.map(addon => {
                          const isSelected = tempAddons.find(a => a.id === addon.id);
                          return (
                            <button
                              key={addon.id}
                              onClick={() => toggleAddon(addon)}
                              className="w-full flex items-center justify-between py-3 border-b border-zinc-100 last:border-0"
                            >
                              <div className="flex flex-col items-start">
                                <span className="font-medium text-zinc-800">{addon.name}</span>
                                <span className="text-sm text-zinc-500">+ R$ {addon.price.toFixed(2)}</span>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-red-600 border-red-600' : 'border-zinc-200'
                              }`}>
                                {isSelected && <Check size={14} className="text-white" />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 border-t border-zinc-100 bg-white flex items-center gap-4">
                <div className="flex items-center border border-zinc-200 rounded-lg p-1">
                  <button 
                    onClick={() => setTempQuantity(Math.max(1, tempQuantity - 1))}
                    className="p-2 text-red-600"
                  >
                    <Minus size={20} />
                  </button>
                  <span className="w-10 text-center font-bold">{tempQuantity}</span>
                  <button 
                    onClick={() => setTempQuantity(tempQuantity + 1)}
                    className="p-2 text-red-600"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <button 
                  onClick={() => addToCart(selectedProductForAddons, tempAddons, tempQuantity)}
                  className="flex-1 bg-red-600 text-white py-4 rounded-lg font-bold hover:bg-red-700 transition-colors"
                >
                  Adicionar • R$ {((selectedProductForAddons.price + tempAddons.reduce((s, a) => s + a.price, 0)) * tempQuantity).toFixed(2)}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Cart Drawer (iFood Style) */}
      <AnimatePresence>
        {isCartOpen && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="relative bg-zinc-50 w-full max-w-md h-full shadow-2xl flex flex-col"
            >
              <div className="p-4 bg-white border-b border-zinc-100 flex items-center gap-4">
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-red-600">
                  <ChevronLeft size={24} />
                </button>
                <div className="flex items-center gap-3">
                  <img 
                    src={COMPANY_INFO.logo} 
                    alt={COMPANY_INFO.name} 
                    className="w-8 h-8 object-contain"
                    referrerPolicy="no-referrer"
                  />
                  <h2 className="text-lg font-bold">Sua sacola</h2>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 p-12 text-center">
                    <ShoppingBag size={80} strokeWidth={1} className="text-zinc-200 mb-4" />
                    <h3 className="text-zinc-900 font-bold text-xl">Sua sacola está vazia</h3>
                    <p className="mt-2 text-sm">Adicione itens para começar seu pedido</p>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="mt-8 flex items-center gap-2 text-red-600 font-bold hover:text-red-700 transition-colors"
                    >
                      <ChevronLeft size={20} />
                      Continuar comprando
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="p-4 border-b border-zinc-50">
                        <h3 className="font-bold text-zinc-400 text-xs uppercase tracking-widest">Itens do pedido</h3>
                      </div>
                      <div className="divide-y divide-zinc-50">
                        {cart.map(item => (
                          <div key={item.cartId} className="p-4 space-y-3">
                            <div className="flex justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-bold text-sm">{item.product.name}</h4>
                                {item.selectedAddons.length > 0 && (
                                  <p className="text-[11px] text-zinc-500 mt-1">
                                    {item.selectedAddons.map(a => a.name).join(', ')}
                                  </p>
                                )}
                              </div>
                              <span className="font-bold text-sm">
                                R$ {((item.product.price + item.selectedAddons.reduce((s, a) => s + a.price, 0)) * item.quantity).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <button 
                                onClick={() => removeFromCart(item.cartId)}
                                className="text-red-600 text-xs font-bold uppercase"
                              >
                                Remover
                              </button>
                              <div className="flex items-center border border-zinc-200 rounded-lg p-1">
                                <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1 text-red-600"><Minus size={16} /></button>
                                <span className="w-8 text-center font-bold text-sm">{item.quantity}</span>
                                <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1 text-red-600"><Plus size={16} /></button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Observations */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                      <div className="flex items-center gap-3 text-zinc-900">
                        <Info size={20} className="text-red-600" />
                        <h3 className="font-bold">Observações</h3>
                      </div>
                      <textarea 
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="Ex: Tirar cebola, ponto da carne, etc."
                        className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:ring-1 focus:ring-red-500 outline-none min-h-[60px]"
                      />
                    </div>

                    {/* Delivery Address */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                      <div className="flex items-center gap-3 text-zinc-900">
                        <MapPin size={20} className="text-red-600" />
                        <h3 className="font-bold">Localidade e Endereço</h3>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Selecione sua localidade</label>
                        <select 
                          value={selectedLocation?.name || ''}
                          onChange={(e) => {
                            const loc = DELIVERY_LOCATIONS.find(l => l.name === e.target.value);
                            setSelectedLocation(loc || null);
                          }}
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:ring-1 focus:ring-red-500 outline-none appearance-none cursor-pointer"
                        >
                          <option value="">Selecione uma localidade...</option>
                          {DELIVERY_LOCATIONS.map(loc => (
                            <option key={loc.name} value={loc.name}>
                              {loc.name} - R$ {loc.fee.toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Endereço detalhado</label>
                        <textarea 
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Rua, número, bairro e ponto de referência"
                          className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:ring-1 focus:ring-red-500 outline-none min-h-[80px]"
                        />
                      </div>
                    </div>

                    {/* Payment */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
                      <h3 className="font-bold">Pagamento</h3>
                      <div className="space-y-2">
                        {(['Pix', 'Dinheiro', 'Cartão'] as const).map(method => (
                          <button
                            key={method}
                            onClick={() => setPaymentMethod(method)}
                            className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                              paymentMethod === method 
                                ? 'bg-red-50 border-red-600 text-red-600' 
                                : 'bg-white border-zinc-100 text-zinc-600'
                            }`}
                          >
                            <span className="font-bold text-sm">{method}</span>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              paymentMethod === method ? 'border-red-600 bg-red-600' : 'border-zinc-200'
                            }`}>
                              {paymentMethod === method && <div className="w-2 h-2 bg-white rounded-full" />}
                            </div>
                          </button>
                        ))}
                      </div>

                      {paymentMethod === 'Dinheiro' && (
                        <div className="space-y-2 pt-2">
                          <label className="text-xs font-bold text-zinc-400 uppercase">Precisa de troco?</label>
                          <input 
                            type="text"
                            value={changeFor}
                            onChange={(e) => setChangeFor(e.target.value)}
                            placeholder="Ex: Troco para R$ 50,00"
                            className="w-full bg-zinc-50 border border-zinc-100 rounded-lg p-3 text-sm focus:ring-1 focus:ring-red-500 outline-none"
                          />
                        </div>
                      )}
                    </div>

                    {/* Summary */}
                    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Subtotal</span>
                        <span>R$ {subtotal.toFixed(2)}</span>
                      </div>
                      {selectedLocation && (
                        <div className="flex justify-between text-sm">
                          <span className="text-zinc-500">Taxa de entrega ({selectedLocation.name})</span>
                          <span>R$ {selectedLocation.fee.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex flex-col gap-1 pt-2 border-t border-zinc-50">
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>R$ {cartTotal.toFixed(2)}</span>
                        </div>
                        {!selectedLocation && (
                          <p className="text-[10px] text-red-500 font-medium">
                            * Selecione uma localidade para calcular o total com entrega.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t border-zinc-100 space-y-3">
                <button 
                  disabled={cart.length === 0}
                  onClick={checkout}
                  className="w-full bg-red-600 text-white py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Fazer pedido
                </button>
                <button 
                  onClick={() => setIsCartOpen(false)}
                  className="w-full bg-zinc-50 text-zinc-700 py-4 rounded-lg font-bold text-sm hover:bg-zinc-100 transition-colors border border-zinc-200 flex items-center justify-center gap-2 shadow-sm"
                >
                  <ChevronLeft size={18} />
                  Continuar comprando
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ProductItem: React.FC<{ product: Product; onClick: () => void }> = ({ product, onClick }) => {
  return (
    <motion.div 
      whileTap={{ backgroundColor: '#f9f9f9' }}
      onClick={onClick}
      className="bg-white p-4 flex gap-4 cursor-pointer hover:bg-zinc-50 transition-colors"
    >
      <div className="flex-1 space-y-1">
        <h3 className="font-bold text-sm text-zinc-900">{product.name}</h3>
        <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
          {product.description}
        </p>
        <div className="pt-2">
          <span className="text-zinc-900 font-bold text-sm">R$ {product.price.toFixed(2)}</span>
        </div>
      </div>
      <div className="w-24 h-24 rounded-lg overflow-hidden bg-red-50 flex-shrink-0 flex items-center justify-center">
        <ProductIcon name={product.icon} size={32} className="text-red-600 opacity-40" />
      </div>
    </motion.div>
  );
};
