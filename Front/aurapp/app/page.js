"use client";
import Navbar from './components/Navbar';
import AuraCircleMotion from './components/AuraCircleMotion';
import UserRanking from './components/UserRanking';
import MotivationalPhrase from './components/MotivationalPhrase';
import { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import Link from 'next/link';


const users = [
  { name: 'Francisco', aura: 1500 },
  { name: 'Nacho', aura: 1000 },
  { name: 'Matias', aura: 950 },
  { name: 'Jaco', aura: 500 },
  { name: 'Camilo', aura: 150 },
];

export default function Home() {
  const [showButton, setShowButton] = useState(true);
  const [auraLevel, setAuraLevel] = useState(1000);
  

  useEffect(() => {
      const handleScroll = () => {
        const ranking = document.getElementById('ranking');
        if (!ranking) return;

        const rankingTop = ranking.getBoundingClientRect().top;
        // Si el top del ranking está dentro de los 300px visibles, ocultamos el botón
        if (rankingTop < window.innerHeight - 300) {
          setShowButton(false);
        } else {
          setShowButton(true);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const auraColor = getAuraColor(auraLevel);
  return (
    <>
      <Navbar aura={auraLevel}/>
      <main id="inicio" className="pt-16 px-4">
        <section className="text-center mt-10 h-screen">
          <h1 className="text-4xl font-bold">Bienvenido Francisco</h1>
          <p className="mt-4 text-gray-600">
            Tu nivel de Aura esta muy bien! Sigue Asi!
          </p>
          <AuraCircleMotion aura={auraLevel}/>
          <MotivationalPhrase />
        </section>
        {showButton && (
        <button
          onClick={() =>
            document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth' })
          }
          className={`fixed bottom-6 right-6 z-50 ${auraColor[0]} ${auraColor[1]} ${auraColor[2]} ${auraColor[3]} text-white rounded-full p-4 shadow-lg transition duration-300`}
        >
          <span className="flex items-center space-x-2 pr-2 font-bold">
            <p> Ver Ranking </p>
          <FaArrowDown className="w-5 h-5" />
          </span>
        </button>
        )}
        <div id="ranking" className="min-h-screen bg-transparent flex items-center justify-center p-4">
          <UserRanking users={users} aura={auraLevel}/>
        </div>
        
      </main>
    </>
  );
  function getAuraColor(aura) {
  if (aura < 500) return ['bg-red-500', 'dark:bg-red-500', 'hover:bg-red-600', 'dark:hover:bg-red-600'];
  if (aura < 1500) return ['bg-indigo-600', 'dark:bg-indigo-600', 'hover:bg-indigo-700', 'dark:hover:bg-indigo-700'];
  if (aura < 2000) return ['bg-cyan-400', 'dark:bg-cyan-400', 'hover:bg-cyan-500', 'dark:hover:bg-cyan-500'];
  return ['bg-yellow-400', 'dark:bg-yellow-400', 'hover:bg-yellow-500', 'dark:hover:bg-yellow-500']; // dorado
  }

}
