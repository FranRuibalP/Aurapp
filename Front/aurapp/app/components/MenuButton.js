import { motion } from "framer-motion";

export default function MenuButton({ isOpen, toggle }) {
  return (
    <button onClick={toggle} className="relative z-50 w-5 h-5 flex flex-col justify-between items-center">
      <motion.span
        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 8 : 0 }}
        className="w-full h-1 bg-white rounded origin-center"
        transition={{ duration: 0.3 }}
      />
      <motion.span
        animate={{ opacity: isOpen ? 0 : 1 }}
        className="w-full h-1 bg-white rounded"
        transition={{ duration: 0.3 }}
      />
      <motion.span
        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -8 : 0 }}
        className="w-full h-1 bg-white rounded origin-center"
        transition={{ duration: 0.3 }}
      />
    </button>
  );
}
