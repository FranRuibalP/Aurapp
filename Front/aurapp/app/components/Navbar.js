'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">Aurapp</h1>
        <div className="md:hidden">
          <button onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        <ul className="hidden md:flex gap-6 text-gray-700">
          <li><a href="#" className="hover:text-indigo-600">Inicio</a></li>
          <li><a href="#" className="hover:text-indigo-600">Características</a></li>
          <li><a href="#" className="hover:text-indigo-600">Contacto</a></li>
        </ul>
      </div>
      {open && (
        <ul className="md:hidden px-4 pb-4 bg-white text-gray-700">
          <li className="py-2"><a href="#" className="block hover:text-indigo-600">Inicio</a></li>
          <li className="py-2"><a href="#" className="block hover:text-indigo-600">Características</a></li>
          <li className="py-2"><a href="#" className="block hover:text-indigo-600">Contacto</a></li>
        </ul>
      )}
    </nav>
  );
}
