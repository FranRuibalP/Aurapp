"use client";
import Navbar from '../app/components/Navbar';
import AuraCircleMotion from '../app/components/AuraCircleMotion';
import UserRanking from '../app/components/UserRanking';
import MotivationalPhrase from '../app/components/MotivationalPhrase';
import { useEffect, useState } from 'react';
import { FaArrowDown } from 'react-icons/fa';
import axios from "axios";
import RootLayout from '@/app/layout';

export default function Home() {
  const [showButton, setShowButton] = useState(true);
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loadingUser, setLoadingUser] = useState(true); // 👈

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser._id;

        axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/${userId}`)
          .then((res) => setUser(res.data))
          .catch((err) => console.error("Error al obtener usuario:", err))
          .finally(() => setLoadingUser(false)); // 👈 ya terminó la carga
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
        setLoadingUser(false);
      }
    } else {
      setLoadingUser(false);
    }

    axios
      .get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users`)
      .then((res) => {
        const cleanUsers = res.data
          .map(user => ({
            name: user.username,
            aura: user.aura || 0,
            profileImage: user.profileImage
          }))
          .sort((a, b) => b.aura - a.aura);
        setUsers(cleanUsers);
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });

    const handleScroll = () => {
      const ranking = document.getElementById('ranking');
      if (!ranking) return;
      const rankingTop = ranking.getBoundingClientRect().top;
      setShowButton(rankingTop >= window.innerHeight - 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loadingUser) {
    return (
      <div className="flex h-screen justify-center items-center">
        <p className="text-xl text-gray-500">Cargando...</p>
      </div>
    );
  }

  const auraLevel = user?.aura || 0;
  const auraColor = getAuraColor(auraLevel);
  const motivationalMessage = getMotivationalMessage(auraLevel);

  const buttonClasses = `
    cursor-pointer
    fixed bottom-6 right-6 z-50
    bg-${auraColor}-600 dark:bg-${auraColor}-600
    hover:bg-${auraColor}-700 dark:hover:bg-${auraColor}-700
    text-white rounded-full p-4 shadow-lg transition duration-300
  `;

  return (
    <>
      <Navbar aura={auraLevel} />

      <div className="hidden 
        bg-rose-600 hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-700
        bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700
        bg-emerald-400 hover:bg-emerald-500 dark:bg-emerald-400 dark:hover:bg-emerald-500
        bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-400 dark:hover:bg-yellow-500"
      ></div>

      <main id="inicio" className="pt-16 px-4 bg-neutral-900">
        <section className="text-center mt-10 h-screen text-zinc-50">
          <h1 className="text-4xl font-bold">
            Bienvenido {user?.username || "Usuario"}
          </h1>
          <p className="mt-4 text-zinc-50">{motivationalMessage}</p>
          <AuraCircleMotion aura={auraLevel} />
          <MotivationalPhrase />
        </section>

        {showButton && (
          <button
            onClick={() =>
              document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth' })
            }
            className={buttonClasses}
          >
            <span className="flex items-center space-x-2 pr-2 font-bold">
              <p>Ver Ranking</p>
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
    if (aura < 500) return "rose";
    if (aura < 1500) return "indigo";
    if (aura < 2000) return "emerald";
    return "yellow";
  }

  function getMotivationalMessage(aura) {
    if (aura < 500) return "Tus niveles de aura estan muy bajos. ¡Eleva frecuencia!";
    if (aura < 1500) return "Estás en el camino correcto, no te detengas.";
    if (aura < 2000) return "Tu aura brilla con fuerza, sigue así.";
    return "Estás iluminando el camino de otros. ¡Increíble!";
  }
}
