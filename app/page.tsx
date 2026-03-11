"use client";
import React, { useState, useEffect } from 'react';
import { ShoppingBasket, Plus, Trash2, CheckCircle, Circle, Tag } from 'lucide-react';

const CATEGORIES = ["Frutas", "Lácteos", "Carnes", "Despensa", "Limpieza", "Otros"];

export default function ShoppingList() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [category, setCategory] = useState('Otros');

  useEffect(() => {
    const saved = localStorage.getItem('mi-compra');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('mi-compra', JSON.stringify(items));
  }, [items]);

  const addItem = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setItems([...items, { id: Date.now(), name: input, category, completed: false }]);
    setInput('');
  };

  const toggleItem = (id) => {
    setItems(items.map(i => i.id === id ? { ...i, completed: !i.completed } : i));
  };

  const deleteItem = (id) => {
    setItems(items.filter(i => i.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 font-sans text-slate-900">
      <div className="max-w-md mx-auto space-y-6">
        <header className="flex items-center gap-3 text-indigo-600">
          <ShoppingBasket size={32} />
          <h1 className="text-2xl font-bold">Mi Lista de la Compra</h1>
        </header>

        <form onSubmit={addItem} className="bg-white p-4 rounded-xl shadow-md space-y-3">
          <input 
            className="w-full p-2 border-b outline-none" 
            placeholder="¿Qué necesitas comprar?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button 
                key={c} type="button" onClick={() => setCategory(c)}
                className={`px-3 py-1 rounded-full text-xs ${category === c ? 'bg-indigo-600 text-white' : 'bg-slate-100'}`}
              >
                {c}
              </button>
            ))}
            <button type="submit" className="ml-auto bg-indigo-600 text-white p-2 rounded-lg"><Plus /></button>
          </div>
        </form>

        <div className="space-y-2">
          {items.map(item => (
            <div key={item.id} className="flex items-center gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
              <div onClick={() => toggleItem(item.id)} className="flex flex-1 items-center gap-3 cursor-pointer">
                {item.completed ? <CheckCircle className="text-emerald-500" /> : <Circle className="text-slate-300" />}
                <span className={item.completed ? 'line-through text-slate-400' : ''}>{item.name} ({item.category})</span>
              </div>
              <button onClick={() => deleteItem(item.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}