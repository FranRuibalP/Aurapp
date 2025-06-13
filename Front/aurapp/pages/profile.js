"use client";
import RootLayout from "../app/layout";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../app/components/Navbar";
import PostCard from "../app/components/PostCard";
import { FiEdit } from "react-icons/fi";
import { Dialog, Transition } from "@headlessui/react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Fragment } from "react";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [dedicatedPosts, setDedicatedPosts] = useState([]);
  const [authoredPosts, setAuthoredPosts] = useState([]);
  const [dedicatedOffset, setDedicatedOffset] = useState(0);
  const [authoredOffset, setAuthoredOffset] = useState(0);
  const [hasMoreDedicated, setHasMoreDedicated] = useState(true);
  const [hasMoreAuthored, setHasMoreAuthored] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState({ username: '', email: '', password: '' });
  const [newImage, setNewImage] = useState(null);
  const [activeTab, setActiveTab] = useState("dedicated");
  const [isSaving, setIsSaving] = useState(false);
  const [alert, setAlert] = useState({ message: "", type: "" });

  const observer = useRef();
  const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

  useEffect(() => {
    if (!storedUser) return;

    axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/${storedUser._id}`)
      .then(res => {
        setUser(res.data);
        setEditData({
          username: res.data.username,
          email: res.data.email,
          password: ""
        });
      });

    loadMorePosts("dedicated");
    loadMorePosts("authored");
  }, []);

  const loadMorePosts = async (type) => {
    const offset = type === "dedicated" ? dedicatedOffset : authoredOffset;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts/user/${storedUser._id}`);
    const filtered = res.data.filter(p =>
      type === "dedicated" ? p.dedicatedTo?._id === storedUser._id : p.author?._id === storedUser._id
    );
    const newPosts = filtered.slice(offset, offset + 10);

    if (type === "dedicated") {
      setDedicatedPosts(prev => [...prev, ...newPosts]);
      setDedicatedOffset(prev => prev + 10);
      if (newPosts.length < 10) setHasMoreDedicated(false);
    } else {
      setAuthoredPosts(prev => [...prev, ...newPosts]);
      setAuthoredOffset(prev => prev + 10);
      if (newPosts.length < 10) setHasMoreAuthored(false);
    }
  };

  const lastPostRef = (node) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        if (activeTab === "dedicated" && hasMoreDedicated) loadMorePosts("dedicated");
        if (activeTab === "authored" && hasMoreAuthored) loadMorePosts("authored");
      }
    });
    if (node) observer.current.observe(node);
  };

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "userImages");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      const { secure_url, public_id } = res.data;
      return [secure_url, public_id];
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl = user.profileImage;
      let newImagePublicId = user.imagePublicId;
      let oldImagePublicId = user.imagePublicId;

      if (newImage) {
        const uploadRes = await uploadImageToCloudinary(newImage);
        if (!uploadRes) throw new Error("Falló la subida de imagen");
        imageUrl = uploadRes[0];
        newImagePublicId = uploadRes[1];
      }

      const payload = {
        username: editData.username,
        email: editData.email,
        password: editData.password,
        newImage: {
          profileImage: imageUrl,
          imagePublicId: newImagePublicId
        },
        oldImagePublicId: oldImagePublicId
      };

      await axios.put(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/${user._id}/data`, payload);
      const updatedUser = await axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/${user._id}`);
      setUser(updatedUser.data);
      setShowModal(false);
      setAlert({ message: "Perfil actualizado con éxito", type: "success" });
    } catch (err) {
      console.error("Error al guardar los cambios:", err);
      setAlert({ message: "Hubo un error al guardar", type: "error" });
    } finally {
      setIsSaving(false);
      setTimeout(() => setAlert({ message: "", type: "" }), 3000);
    }
  };

  const getAuraColor = (aura) => {
    if (aura < 500) return "rose";
    if (aura < 1500) return "indigo";
    if (aura < 2000) return "emerald";
    return "yellow";
  };

  const auraColor = getAuraColor(user?.aura);

  const auraHistoryData = user?.auraHistory?.map(entry => ({
    date: new Date(entry.date).toLocaleDateString(),
    aura: entry.value
  })) || [];

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-tr from-neutral-950 via-${auraColor}-950 to-${auraColor}-600 text-zinc-50`}>
      <Navbar />

      {/* Safelist de colores para Tailwind */}
      <div className="hidden 
        bg-rose-600 hover:bg-rose-700 border-rose-600 to-rose-600 to-rose-950
        bg-indigo-600 hover:bg-indigo-700 border-indigo-600 to-indigo-600 to-indigo-950
        bg-emerald-600 hover:bg-emerald-700 border-emerald-600 to-emerald-600 to-emerald-950 
        bg-yellow-600 hover:bg-yellow-700 border-yellow-600 to-yellow-600 to-yellow-950"
      ></div>

      <div className="pt-24 px-4 flex flex-col items-center gap-4">
        <div className="relative w-32 h-32">
          <img src={user.profileImage} alt="Perfil" className="rounded-full w-full h-full object-cover border-4 shadow border-white" />
        </div>

        <h1 className="text-3xl font-bold">{user.username}</h1>
        <div className={`text-lg font-semibold`}>Aura: {user.aura}</div>

        <button
          onClick={() => setShowModal(true)}
          className={`cursor-pointer bg-${auraColor}-600 hover:bg-${auraColor}-700 text-white px-4 py-2 rounded-lg`}
        >
          Editar perfil
        </button>

        <div className="w-full max-w-2xl mt-6">
          <div className="flex border-b mb-4">
            {["dedicated", "authored", "aura"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer flex-1 py-2 ${activeTab === tab ? `border-b-2 border-${auraColor}-600 font-bold` : "text-zinc-400"}`}
              >
                {tab === "dedicated" ? "Posts dedicados" : tab === "authored" ? "Posts creados" : "Historial de Aura"}
              </button>
            ))}
          </div>

          {activeTab === "dedicated" && dedicatedPosts.map((post, i) => (
            <div className="mb-6" key={post._id} ref={i === dedicatedPosts.length - 1 ? lastPostRef : null}>
              <PostCard post={post} />
            </div>
          ))}
          {activeTab === "authored" && authoredPosts.map((post, i) => (
            <div className="mb-6" key={post._id} ref={i === authoredPosts.length - 1 ? lastPostRef : null}>
              <PostCard post={post} />
            </div>
          ))}
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

      <Transition show={showModal} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setShowModal(false)}>
          <div className="flex min-h-screen items-center justify-center bg-black/30 p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md transform transition-all">
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
                    <button onClick={() => setShowModal(false)} className="cursor-pointer px-4 py-2 bg-gray-300 dark:bg-gray-700 hover:bg-gray-600 rounded">Cancelar</button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className={`cursor-pointer px-4 py-2 flex items-center justify-center gap-2 bg-${auraColor}-600 hover:bg-${auraColor}-700 text-white rounded disabled:opacity-60`}
                    >
                      {isSaving ? (
                        <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                        </svg>
                      ) : "Guardar"}
                    </button>
                  </div>
                  {alert.message && (
                    <div className={`mt-4 px-4 py-2 text-sm rounded text-center ${
                      alert.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
                    }`}>
                      {alert.message}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
