"use client";
import Link from "next/link";
import { useState } from "react";
import MenuButton from "./MenuButton";
import MobileMenu from "./MobileMenu";

export default function Navbar(aura) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 w-full px-4 py-2 flex justify-between items-center bg-black z-50">
      <h1 className="text-white font-bold text-xl">Aurapp</h1>
      <MenuButton isOpen={isOpen} toggle={toggleMenu} />
      <MobileMenu isOpen={isOpen}>
        <a href="/#inicio" onClick={toggleMenu} className="text-white text-lg my-2">Inicio</a>
        <a href="/#ranking" onClick={toggleMenu} className="text-white text-lg my-2">Ranking</a>
        <Link href={{ pathname: "/posts", query: { aura } }} passHref={true} onClick={toggleMenu} className="text-white text-lg my-2">Posts</Link>
        <Link href={{ pathname: "/profile", query: { aura } }} passHref={true} onClick={toggleMenu} className="text-white text-lg my-2">Perfil</Link>
      </MobileMenu>
    </nav>
  );
}
