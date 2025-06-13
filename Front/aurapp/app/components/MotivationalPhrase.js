"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";



export default function MotivationalPhrase() {
  const frases = [
  { texto: "No me retracto de mis palabras... Ese es mi camino ninja!", autor: "Naruto Uzumaki" },
  { texto: "El poder viene en respuesta a una necesidad, no a un deseo.", autor: "Goku" },
  { texto: "Haz una elección. Vive con ella. No importa qué decidas, lo importante es que no te detengas.", autor: "Levi Ackerman" },
  { texto: "Solo aquellos que toman sus propias decisiones pueden cambiar el destino.", autor: "Yoichi Isagi" },
  { texto: "Si no haces lo que querés, entonces no sos libre.", autor: "Ichigo Kurosaki" },
  { texto: "Son nuestras elecciones las que muestran lo que somos, mucho más que nuestras habilidades.", autor: "Albus Dumbledore" },
  { texto: "Si luchás por lo que querés, no hay nada imposible.", autor: "Lionel Messi" },
  { texto: "La pelota no se mancha.", autor: "Diego Maradona" },
  { texto: "Nunca dejes de luchar por tus sueños. Yo estuve muchas veces por rendirme, pero seguí.", autor: "Ángel Di María" },
  { texto: "El talento sin trabajo no sirve de nada.", autor: "Cristiano Ronaldo" },
];  
  const [indice, setIndice] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndice((prev) => (prev + 1) % frases.length);
    }, 10000); // cada 10 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-6 h-24 relative overflow-hidden max-w-xs mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={indice}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="absolute w-full text-center text-zinc-50 italic text-sm sm:text-base px-2"
        >
          "{frases[indice].texto}"
          <br />
          <span className="not-italic font-semibold block mt-1">— {frases[indice].autor}</span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
