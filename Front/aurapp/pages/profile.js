"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../app/components/Navbar";
import PostCard from "../app/components/PostCard";
import { FiEdit } from "react-icons/fi";
import { Dialog } from "@headlessui/react";
import RootLayout from "../app/layout";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [dedicatedPosts, setDedicatedPosts] = useState([]);
  const [authoredPosts, setAuthoredPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '', password: '' });
  const [newImage, setNewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("dedicated");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
    setEditData({ username: storedUser.username, email: storedUser.email, password: "" });

    axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts/user/${storedUser._id}`)
      .then(res => {
        const dedicated = res.data.filter(p => p.dedicatedTo._id === storedUser._id);
        const authored = res.data.filter(p => p.author._id === storedUser._id);
        setDedicatedPosts(dedicated);
        setAuthoredPosts(authored);
      });
  }, []);

  const handleSave = async () => {
    try {
      let imageUrl = user.profileImage;
      if (newImage) {
        await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/delete-image`, { publicId: user.imagePublicId });

        const formData = new FormData();
        formData.append("image", newImage);
        const res = await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/upload-image`, formData);
        imageUrl = res.data.imageUrl;
      }

      const updatedUser = { ...editData, profileImage: imageUrl };
      await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/${user._id}`, updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setShowModal(false);
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
    }
  };

  const auraHistoryData = user?.auraHistory?.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    aura: entry.aura
  })) || [];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
      <Navbar />
      <div className="pt-24 px-4 flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <img src={user.profileImage} alt="Perfil" className="rounded-full w-full h-full object-cover border shadow" />
          <button onClick={() => setShowModal(true)} className="absolute top-0 right-0 p-1 bg-white/70 rounded-full">
            <FiEdit className="text-gray-800" />
          </button>
        </div>

        <h1 className="text-2xl font-bold">{user.username}</h1>
        <div className={`text-lg font-semibold ${user.aura >= 0 ? "text-green-500" : "text-red-500"}`}>
          Aura: {user.aura}
        </div>

        <button onClick={() => setShowModal(true)} className="bg-violet-600 text-white px-4 py-2 rounded-lg">Editar perfil</button>

        <div className="w-full max-w-2xl mt-6">
          <div className="flex border-b mb-4">
            <button onClick={() => setActiveTab("dedicated")} className={`flex-1 py-2 ${activeTab === "dedicated" ? "border-b-2 border-violet-600 font-bold" : "text-gray-500"}`}>Posts dedicados</button>
            <button onClick={() => setActiveTab("authored")} className={`flex-1 py-2 ${activeTab === "authored" ? "border-b-2 border-violet-600 font-bold" : "text-gray-500"}`}>Posts creados</button>
            <button onClick={() => setActiveTab("aura")} className={`flex-1 py-2 ${activeTab === "aura" ? "border-b-2 border-violet-600 font-bold" : "text-gray-500"}`}>Aura</button>
          </div>

          {activeTab === "dedicated" && dedicatedPosts.map(post => <PostCard key={post._id} post={post} />)}
          {activeTab === "authored" && authoredPosts.map(post => <PostCard key={post._id} post={post} />)}
          {activeTab === "aura" && (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={auraHistoryData}>
                <XAxis dataKey="date" stroke="#8884d8" />
                <YAxis stroke="#8884d8" />
                <Tooltip />
                <Line type="monotone" dataKey="aura" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">Editar Perfil</h2>
          <div className="flex flex-col gap-4">
            <div className="relative w-24 h-24 mx-auto">
              <img src={newImage ? URL.createObjectURL(newImage) : user.profileImage} className="rounded-full w-full h-full object-cover border" />
              <label className="absolute bottom-0 right-0 p-1 bg-white/80 rounded-full cursor-pointer">
                <FiEdit className="text-gray-800" />
                <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} className="hidden" />
              </label>
            </div>
            <input type="text" placeholder="Nombre de usuario" value={editData.username} onChange={(e) => setEditData({ ...editData, username: e.target.value })} className="border p-2 rounded" />
            <input type="email" placeholder="Correo" value={editData.email} onChange={(e) => setEditData({ ...editData, email: e.target.value })} className="border p-2 rounded" />
            <input type="password" placeholder="Nueva contraseña" value={editData.password} onChange={(e) => setEditData({ ...editData, password: e.target.value })} className="border p-2 rounded" />

            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded">Cancelar</button>
              <button onClick={handleSave} className="px-4 py-2 bg-violet-600 text-white rounded">Guardar</button>
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
