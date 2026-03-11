"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart, Plus, CheckCircle2, Circle, RotateCcw, Share2, Receipt } from 'lucide-react';

export default function ListaCompra() {
  const [items, setItems] = useState<{ id: number; text: string; price: number; completed: boolean }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mi-lista-gastos-v2');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mi-lista-gastos-v2', JSON.stringify(items));
  }, [items]);

  const addItem = (text: string, price: string = "0") => {
    if (text.trim()) {
      const p = parseFloat(price.replace(',', '.')) || 0;
      setItems([{ id: Date.now(), text: text.trim(), price: p, completed: false }, ...items]);
      setNewItem('');
      setNewPrice('');
    }
  };

  // CATEGORÍAS RÁPIDAS
  const fastItems = [
    { name: 'Leche', icon: '🥛' }, { name: 'Huevos', icon: '🥚' },
    { name: 'Pan', icon: '🥖' }, { name: 'Agua', icon: '💧' },
    { name: 'Carne', icon: '🥩' }, { name: 'Pescado', icon: '🐟' },
    { name: 'Fruta', icon: '🍎' }, { name: 'Verdura', icon: '🥦' },
    { name: 'Pasta', icon: '🍝' }, { name: 'Yogures', icon: '🍦' },
    { name: 'Cerveza', icon: '🍺' }, { name: 'Vino', icon: '🍷' },
    { name: 'Arroz', icon: '🍚' }, { name: 'Café', icon: '☕' },
    { name: 'Limpieza', icon: '🧹' }, { name: 'Papel Hig.', icon: '🧻' }
  ];

  const shareTicket = () => {
    const comprados = items.filter(i => i.completed);
    const total = comprados.reduce((acc, i) => acc + i.price, 0);
    const listText = comprados.map(i => `✅ ${i.text}: ${i.price.toFixed(2)}€`).join('\n');
    const text = encodeURIComponent(`🧾 *MI TICKET DE COMPRA*\n\n${listText}\n\n---\n💰 *TOTAL: ${total.toFixed(2)}€*`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const totalGasto = items.filter(i => i.completed).reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-stone-50 p-4 font-sans text-slate-900">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-stone-200">
        
        {/* CABECERA */}
        <div className="bg-emerald-600 p-8 text-white">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-black flex items-center gap-2 tracking-tighter">
              <ShoppingCart size={24} /> GASTO CARRITO
            </h1>
            <div className="text-3xl font-black bg-emerald-700 px-4 py-1 rounded-2xl shadow-inner border border-emerald-500/30">
              {totalGasto.toFixed(2)}€
            </div>
          </div>
          
          <div className="flex gap-3">
            <button onClick={shareTicket} className="flex-1 flex items-center justify-center gap-2 text-xs font-black uppercase bg-white text-emerald-700 px-4 py-3 rounded-xl shadow-lg active:scale-95 transition">
              <Receipt size={16} /> Enviar Ticket
            </button>
            <button onClick={() => { if(confirm('¿Reiniciar lista?')) setItems([]) }} className="p-3 bg-emerald-700 rounded-xl hover:bg-emerald-800 transition">
              <RotateCcw size={20} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* BARRA DE PRODUCTOS RÁPIDOS (Deslizable) */}
          <p className="text-[10px] font-black uppercase tracking-widest text-stone-400 mb-3 ml-1">Añadir rápido</p>
          <div className="flex gap-2 mb-8 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
            {fastItems.map((item) => (
              <button
                key={item.name}
                onClick={() => addItem(item.name)}
                className="flex flex-col items-center gap-1 min-w-[70px] p-3 bg-stone-50 border-2 border-stone-100 rounded-2xl hover:border-emerald-500 hover:bg-emerald-50 transition-all active:scale-90"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[10px] font-black uppercase text-stone-500">{item.name}</span>
              </button>
            ))}
          </div>

          {/* FORMULARIO MANUAL */}
          <form onSubmit={(e) => { e.preventDefault(); addItem(newItem, newPrice); }} className="space-y-3 mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Otro producto..."
                className="flex-1 p-4 bg-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
              <input
                type="text"
                inputMode="decimal"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0€"
                className="w-20 p-4 bg-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-center"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 active:scale-95 transition">
              <Plus size={24} strokeWidth={4} /> AÑADIR PRODUCTO
            </button>
          </form>

          {/* LISTA */}
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${item.completed ? 'bg-stone-50 border-transparent opacity-60' : 'bg-white border-stone-100 shadow-sm'}`}>
                <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                  {item.completed ? (
                    <div className="bg-emerald-500 rounded-full p-1 shadow-lg shadow-emerald-200"><CheckCircle2 className="text-white" size={20} /></div>
                  ) : (
                    <Circle className="text-stone-300" size={26} />
                  )}
                  <div>
                    <p className={`font-black text-lg leading-tight ${item.completed ? 'line-through text-stone-400' : 'text-slate-800'}`}>{item.text}</p>
                    <p className="text-xs font-black text-emerald-600 italic">{item.price > 0 ? `${item.price.toFixed(2)}€` : 'Poner precio...'}</p>
                  </div>
                </div>
                
                {/* Editor de precio rápido */}
                {!item.completed && (
                  <div className="flex items-center bg-stone-100 rounded-lg px-2 mr-2">
                    <input 
                      type="text"
                      inputMode="decimal"
                      placeholder="€"
                      className="w-10 p-1 bg-transparent text-xs text-center focus:outline-none font-black"
                      onBlur={(e) => {
                        if(e.target.value) {
                          setItems(items.map(i => i.id === item.id ? {...i, price: parseFloat(e.target.value.replace(',','.')) || 0} : i));
                          e.target.value = "";
                        }
                      }}
                    />
                  </div>
                )}
                
                <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="text-stone-300 hover:text-red-500 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-10 opacity-20 italic font-black text-xs uppercase tracking-[0.2em]">Tu despensa está vacía</div>
          )}
        </div>
      </div>
    </div>
  );
}
