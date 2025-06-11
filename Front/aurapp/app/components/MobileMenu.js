import { motion, AnimatePresence } from "framer-motion";

export default function MobileMenu({ isOpen, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 left-0 w-full bg-black bg-opacity-90 flex flex-col items-center py-6 z-40"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
