"use client";
import React, { useState, useEffect } from 'react';
import { Trash2, ShoppingCart, Plus, CheckCircle2, Circle, RotateCcw, Egg, Milk, UtensilsCrossed, Apple, Beef, Share2, Receipt } from 'lucide-react';

export default function ListaCompra() {
  const [items, setItems] = useState<{ id: number; text: string; price: number; completed: boolean }[]>([]);
  const [newItem, setNewItem] = useState('');
  const [newPrice, setNewPrice] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('mi-lista-gastos');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mi-lista-gastos', JSON.stringify(items));
  }, [items]);

  const addItem = (text: string, price: string = "0") => {
    if (text.trim()) {
      const p = parseFloat(price.replace(',', '.')) || 0;
      setItems([{ id: Date.now(), text: text.trim(), price: p, completed: false }, ...items]);
      setNewItem('');
      setNewPrice('');
    }
  };

  const updatePrice = (id: number, priceStr: string) => {
    const p = parseFloat(priceStr.replace(',', '.')) || 0;
    setItems(items.map(item => item.id === id ? { ...item, price: p } : item));
  };

  const shareTicket = () => {
    const comprados = items.filter(i => i.completed);
    const total = comprados.reduce((acc, i) => acc + i.price, 0);
    const listText = comprados.map(i => `✅ ${i.text}: ${i.price.toFixed(2)}€`).join('\n');
    const text = encodeURIComponent(`🧾 *MI TICKET DE COMPRA*\n\n${listText}\n\n--- \n💰 *TOTAL: ${total.toFixed(2)}€*`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const toggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  const totalGasto = items.filter(i => i.completed).reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-stone-50 p-4 font-sans text-slate-900">
      <div className="max-w-md mx-auto bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-stone-200">
        
        {/* Cabecera con Total */}
        <div className="bg-emerald-600 p-8 text-white relative">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-xl font-black flex items-center gap-2">
              <ShoppingCart size={24} /> GASTO TOTAL
            </h1>
            <div className="text-3xl font-black bg-emerald-700 px-4 py-1 rounded-xl shadow-inner">
              {totalGasto.toFixed(2)}€
            </div>
          </div>
          
          <div className="bg-emerald-900/30 rounded-full h-3 w-full">
            <div className="bg-emerald-300 h-3 rounded-full transition-all duration-700" style={{ width: `${items.length > 0 ? (items.filter(i => i.completed).length / items.length) * 100 : 0}%` }}></div>
          </div>
          
          <div className="flex justify-between mt-4">
            <button onClick={shareTicket} className="flex items-center gap-2 text-xs font-bold uppercase bg-white text-emerald-700 px-4 py-2 rounded-full shadow-lg active:scale-95 transition">
              <Receipt size={16} /> Ver Ticket
            </button>
            <button onClick={() => { if(confirm('¿Reiniciar lista?')) setItems([]) }} className="p-2 bg-emerald-700 rounded-full">
              <RotateCcw size={18} />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Inputs de Producto y Precio */}
          <form onSubmit={(e) => { e.preventDefault(); addItem(newItem, newPrice); }} className="space-y-3 mb-8">
            <div className="flex gap-2">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Producto..."
                className="flex-1 p-4 bg-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold"
              />
              <input
                type="text"
                inputMode="decimal"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value)}
                placeholder="0.00€"
                className="w-24 p-4 bg-stone-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold text-center"
              />
            </div>
            <button type="submit" className="w-full bg-emerald-600 text-white p-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
              <Plus size={24} strokeWidth={3} /> AÑADIR A LA LISTA
            </button>
          </form>

          {/* Lista de productos */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${item.completed ? 'bg-stone-50 border-transparent opacity-60' : 'bg-white border-stone-100 shadow-sm'}`}>
                <div className="flex items-center gap-3 flex-1 cursor-pointer" onClick={() => toggleItem(item.id)}>
                  {item.completed ? (
                    <div className="bg-emerald-500 rounded-full p-1"><CheckCircle2 className="text-white" size={20} /></div>
                  ) : (
                    <Circle className="text-stone-300" size={24} />
                  )}
                  <div>
                    <p className={`font-bold ${item.completed ? 'line-through text-stone-400' : 'text-slate-700'}`}>{item.text}</p>
                    <p className="text-xs text-emerald-600 font-black">{item.price.toFixed(2)}€</p>
                  </div>
                </div>
                
                {/* Editar precio rápido */}
                {!item.completed && (
                  <input 
                    type="text"
                    inputMode="decimal"
                    placeholder="€"
                    className="w-14 p-1 text-xs border-b-2 border-stone-200 text-center focus:outline-none focus:border-emerald-500 font-bold"
                    onBlur={(e) => updatePrice(item.id, e.target.value)}
                  />
                )}
                
                <button onClick={() => setItems(items.filter(i => i.id !== item.id))} className="ml-2 text-stone-300 hover:text-red-500">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-10 opacity-20 italic">Añade productos y sus precios...</div>
          )}
        </div>
      </div>
    </div>
  );
}
