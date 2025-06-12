"use client";
import Navbar from '../app/components/Navbar';
import AuraCircleMotion from '../app/components/AuraCircleMotion';
import UserRanking from '../app/components/UserRanking';
import MotivationalPhrase from '../app/components/MotivationalPhrase';
import { useEffect, useState } from 'react';
import RootLayout from "../app/layout";
import { FaArrowDown } from 'react-icons/fa';
import axios from "axios";
import dotenv from "dotenv";

export default function Home() {
  const [showButton, setShowButton] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  console.log(process.env.URL_BACKEND);
  useEffect(() => {
    // Leer usuario del localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }

    // Obtener usuarios para el ranking
    axios
      .get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users`) 
      .then((res) => {
        const cleanUsers = res.data
      .map(user => ({
        name: user.username,
        aura: user.aura || 0,
      }))
      .sort((a, b) => b.aura - a.aura); // Ordenar de mayor a menor aura
      console.log(cleanUsers);
      setUsers(cleanUsers);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });

    // Manejar scroll
    const handleScroll = () => {
      const ranking = document.getElementById('ranking');
      if (!ranking) return;
      const rankingTop = ranking.getBoundingClientRect().top;
      setShowButton(rankingTop >= window.innerHeight - 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const auraLevel = user?.aura || 0;
  const auraColor = getAuraColor(auraLevel);

  return (
    <>
      <Navbar aura={auraLevel} />
      <main id="inicio" className="pt-16 px-4">
        <section className="text-center mt-10 h-screen">
          <h1 className="text-4xl font-bold">
            Bienvenido {user?.username || "Usuario"}
          </h1>
          <p className="mt-4 text-gray-600">
            Tu nivel de Aura está {auraLevel >= 1000 ? "muy bien" : "en progreso"}! ¡Sigue así!
          </p>
          <AuraCircleMotion aura={auraLevel} />
          <MotivationalPhrase />
        </section>

        {showButton && (
          <button
            onClick={() =>
              document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth' })
            }
            className={`fixed bottom-6 right-6 z-50 ${auraColor.join(" ")} text-white rounded-full p-4 shadow-lg transition duration-300`}
          >
            <span className="flex items-center space-x-2 pr-2 font-bold">
              <p> Ver Ranking </p>
              <FaArrowDown className="w-5 h-5" />
            </span>
          </button>
        )}

        <div id="ranking" className="min-h-screen bg-transparent flex items-center justify-center p-4">
          <UserRanking users={users} aura={auraLevel} />
        </div>
      </main>
    </>
  );

  function getAuraColor(aura) {
    if (aura < 500) return ['bg-red-500', 'dark:bg-red-500', 'hover:bg-red-600', 'dark:hover:bg-red-600'];
    if (aura < 1500) return ['bg-indigo-600', 'dark:bg-indigo-600', 'hover:bg-indigo-700', 'dark:hover:bg-indigo-700'];
    if (aura < 2000) return ['bg-cyan-400', 'dark:bg-cyan-400', 'hover:bg-cyan-500', 'dark:hover:bg-cyan-500'];
    return ['bg-yellow-400', 'dark:bg-yellow-400', 'hover:bg-yellow-500', 'dark:hover:bg-yellow-500'];
  }
}
