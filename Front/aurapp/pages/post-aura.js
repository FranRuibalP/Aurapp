"use client";
import { useState, useEffect } from "react";
import Navbar from "../app/components/Navbar"; // Ruta según tu estructura
import RootLayout from "../app/layout";
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from "next/navigation";


export default function PostAura({}) {
  
  const auraLevel = 1000
  const [aura, setAura] = useState(0);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const color = getAuraColor(auraLevel);
  const [selectedUser, setSelectedUser] = useState("");
  const friends = ["Francisco", "Nacho", "Matias", "Jaco", "Camilo"];
  

  const handleAuraChange = (amount) => {
    setAura((prev) => prev + amount);
  };

  const canPost = aura !== 0 && description.trim() !== "" && selectedUser !== "";

  const { number } = useSpring({
    number: aura,
    from: { number: 0 },
    config: { tension: 170, friction: 26 },
  });

  

  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);
  const handlePost = () => {
  setIsPosting(true);
  setTimeout(() => {
    router.push("/posts");
  }, 5000); // 5 segundos
};

  return (
    
      
    <div className={`min-h-screen p-6 bg-transparent bg-opacity-10`}>
      <Navbar />
      <h1 className="text-center text-2xl font-bold mt-10 mb-6 dark:text-white text-black">
        Ajuste de Aura
      </h1>

      <div className="text-6xl font-bold text-center mb-6 dark:text-white text-black">
        <animated.span>{number.to((n) => Math.floor(n))}</animated.span>
      </div>


      <div className="flex justify-center gap-10 mb-6">
        {/* Resta */}
        <div className="flex flex-col gap-4">
          {[50, 100, 500].map((val) => (
            <button
              key={`sub-${val}`}
              onClick={() => handleAuraChange(-val)}
              className={`border-2 ${color[7]} ${color[5]} ${color[6]} font-semibold px-5 py-2 rounded-full bg-transparent`}
            >
              -{val}
            </button>
          ))}
        </div>

        {/* Suma */}
        <div className="flex flex-col gap-4">
          {[50, 100, 500].map((val) => (
            <button
              key={`add-${val}`}
              onClick={() => handleAuraChange(val)}
              className={`${color[0]} text-white font-semibold px-5 py-2 rounded-full`}
            >
              +{val}
            </button>
          ))}
        </div>
      </div>
            <div className="mb-6">
        <label className="block mb-2 font-medium text-black dark:text-white">
          Elegí destinatario del aura
        </label>
        <select
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-black"
        >
          <option value="" disabled>
            Seleccioná un usuario
          </option>
          {friends.map((user, idx) => (
            <option key={idx} value={user}>
              {user}
            </option>
          ))}
        </select>
      </div>


      <div className="mb-6">
        <label className="block mb-2 font-medium text-black dark:text-white">
          Descripción
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explicá el motivo del cambio..."
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-black"
          rows={4}
        />
      </div>


      {/* Switch con Tailwind */}
      <div className="flex justify-center items-center gap-3 mb-6">
        <div
          onClick={() => setIsPrivate(!isPrivate)}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            isPrivate ? color[0] : "bg-gray-400"
          }`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
              isPrivate ? "translate-x-6" : "translate-x-0"
            }`}
          ></div>
        </div>
        <span className="text-black dark:text-white">Inmediato</span>
      </div>

      <div className="flex justify-center items-center">
        <button
  onClick={handlePost}
  disabled={!canPost || isPosting}
  className={`px-6 py-3 rounded font-bold flex items-center justify-center gap-2 ${
    canPost && !isPosting
      ? `${color[0]} text-white`
      : "bg-gray-400 text-white cursor-not-allowed"
  }`}
>
  {isPosting ? (
    <svg
      className="animate-spin h-5 w-5 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  ) : (
    "Postear"
  )}
</button>

      </div>
    </div>
    
  );
  function getAuraColor(aura) {
  if (aura < 500) return ['bg-red-500', 'dark:bg-red-500', 'hover:bg-red-600', 'dark:hover:bg-red-600', 'text-red-500', 'dark:text-red-500', 'border-red-500', 'dark:border-red-500'];
  if (aura < 1500) return ['bg-indigo-600', 'dark:bg-indigo-600', 'hover:bg-indigo-700', 'dark:hover:bg-indigo-700', 'text-indigo-600', 'dark:text-indigo-600', 'border-indigo-600', 'dark:border-indigo-600'];
  if (aura < 2000) return ['bg-cyan-400', 'dark:bg-cyan-400', 'hover:bg-cyan-500', 'dark:hover:bg-cyan-500', 'text-cyan-400', 'dark:text-cyan-400', 'border-cyan-400', 'dark:border-cyan-400'];
  return ['bg-yellow-400', 'dark:bg-yellow-400', 'hover:bg-yellow-500', 'dark:hover:bg-yellow-500', 'text-yellow-400', 'dark:text-yellow-400', 'border-yellow-400', 'dark:border-yellow-400']; // dorado
  }
}
