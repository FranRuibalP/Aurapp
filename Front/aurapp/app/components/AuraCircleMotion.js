'use client';

import { motion } from 'framer-motion';

export default function AuraCircle({ aura }) {
    const auraBorderColor = getBorderAuraColor(aura);
    const auraBgColor = getBgAuraColor(aura);
    return (
        <div className="flex items-center justify-center mt-20 mb-20  bg-transparent">
        <div className="relative">
            {/* Aura Glow - fondo difuminado pulsante */}
            <motion.div
            className={`absolute inset-0 rounded-full ${auraBgColor} blur-xl opacity-40 z-0`}
            animate={{
                scale: [1, 1.2, 1],
                opacity: [0.4, 0.6, 0.4],
            }}
            transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            />
            <motion.div
            className={`absolute inset-0 rounded-full ${auraBgColor} blur-3xl opacity-30 z-0"`}
            animate={{
                scale: [1, 1.3, 1],
                opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
                duration: 3.2,
                repeat: Infinity,
                ease: 'easeInOut',
            }}
            />

            {/* Círculo con borde */}
            <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className={`relative w-52 h-52 sm:w-64 sm:h-64 md:w-98 md:h-98  rounded-full border-4 ${auraBorderColor}  flex items-center justify-center z-10`}
            >
            <span className="text-white text-4xl sm:text-5xl md:text-7xl font-bold">{aura}</span>
            </motion.div>
        </div>
        </div>
    );
    function getBorderAuraColor(aura) {
    if (aura < 500) return 'border-red-500';
    if (aura < 1500) return 'border-indigo-600';
    if (aura < 2000) return 'border-cyan-400';
    return 'border-yellow-400'; // dorado
    }
    function getBgAuraColor(aura) {
    if (aura < 500) return 'bg-red-500';
    if (aura < 1500) return 'bg-indigo-600';
    if (aura < 2000) return 'bg-cyan-400';
    return 'bg-yellow-400'; // dorado
    }
}
