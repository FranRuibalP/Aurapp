"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MenuButton from "./MenuButton";
import MobileMenu from "./MobileMenu";

export default function Navbar({ aura }) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/"); // redirige a la landing
  };

  return (
    <nav className="fixed top-0 left-0 w-full px-4 py-2 flex justify-between items-center bg-black z-50">
      <h1 className="text-white font-bold text-xl">Aurapp</h1>
      <MenuButton isOpen={isOpen} toggle={toggleMenu} />
      <MobileMenu isOpen={isOpen}>
        <a href="/home/#inicio" onClick={toggleMenu} className="text-white text-lg my-2">Inicio</a>
        <a href="/home/#ranking" onClick={toggleMenu} className="text-white text-lg my-2">Ranking</a>
        <Link href={{ pathname: "/posts", query: { aura } }} passHref className="text-white text-lg my-2" onClick={toggleMenu}>Posts</Link>
        <Link href={{ pathname: "/profile", query: { aura } }} passHref className="text-white text-lg my-2" onClick={toggleMenu}>Perfil</Link>
        <button
          onClick={() => {
            toggleMenu();
            handleLogout();
          }}
          className="cursor-pointer text-white text-lg my-2 text-left"
        >
          Cerrar sesión
        </button>
      </MobileMenu>
    </nav>
  );
}
