"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Home from "../pages/home"
import axios from "axios";

export default function LandingPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState(0);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const auraColors = ["from-red-500", "from-indigo-500", "from-cyan-400", "from-yellow-400"];
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColor((prev) => (prev + 1) % auraColors.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}auth/login`, loginData);
      localStorage.setItem("token", res.data.token);
      const resUser = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/`+res.data.user.id);
      console.log(resUser.data);
      localStorage.setItem("user", JSON.stringify(resUser.data));
      router.replace("/home");
      //setIsLoggedIn(true);
    } catch (err) {
      setError("Credenciales incorrectas o error del servidor");
    }
  };

  const handleRegister = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}auth/register`, registerData);
      setRegisterSuccess(true);
      setRegisterData({ username: "", email: "", password: "" });
    } catch (err) {
      setError("Error al registrar. Verificá los datos.");
    }
  };
    return (
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key={currentColor}
              className={`absolute w-96 h-96 rounded-full blur-3xl bg-gradient-to-br ${auraColors[currentColor]}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, scale: [2, 1.5, 2] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 2 }}
            />
          </AnimatePresence>
        </div>


        <h1 className="z-10 text-4xl font-bold mb-8">Bienvenido a Aurapp</h1>

        <button
          onClick={() => {
            setModalOpen(true);
            setError("");
            setRegisterSuccess(false);
          }}
          className="z-10 bg-white text-black px-6 py-3 rounded-full font-semibold hover:bg-gray-200 transition"
        >
          Get Started
        </button>

        <AnimatePresence>
          {modalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-20"
            >
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                className="bg-white text-black rounded-xl shadow-xl w-[90%] max-w-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-6 relative"
              >
                {/* Botón de cierre */}
                <button
                  onClick={() => setModalOpen(false)}
                  className="absolute top-2 right-4 text-black text-xl font-bold"
                >
                  ×
                </button>

                {/* Iniciar Sesión */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded"
                    value={loginData.email}
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 mb-3 border rounded"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
                  <button
                    className="bg-black text-white px-4 py-2 rounded w-full"
                    onClick={handleLogin}
                  >
                    Entrar
                  </button>
                </div>

                {/* Registrarse */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Registrarse</h2>
                  <input
                    type="text"
                    placeholder="Usuario"
                    className="w-full p-2 mb-3 border rounded"
                    value={registerData.username}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, username: e.target.value })
                    }
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    className="w-full p-2 mb-3 border rounded"
                    value={registerData.email}
                    onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full p-2 mb-3 border rounded"
                    value={registerData.password}
                    onChange={(e) =>
                      setRegisterData({ ...registerData, password: e.target.value })
                    }
                  />
                  <button
                    className="bg-black text-white px-4 py-2 rounded w-full"
                    onClick={handleRegister}
                  >
                    Registrarse
                  </button>
                  {registerSuccess && (
                    <p className="text-green-600 text-sm mt-2">Usuario registrado con éxito ✅</p>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  
}
