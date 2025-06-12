"use client";
import { useState, useEffect } from "react";
import Navbar from "../app/components/Navbar"; // Ruta según tu estructura
import RootLayout from "../app/layout";
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from "next/navigation";
import dotenv from "dotenv";
import axios from "axios";

export default function PostAura({}) {
  
  const auraLevel = 1000
  const [aura, setAura] = useState(0);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const color = getAuraColor(auraLevel);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [author, setAuthor] = useState("");
  const [users, setUsers] = useState([]);
  const [dedicatedTo, setDedicatedTo] = useState("");
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setAuthor(parsedUser._id);
      } catch (e) {
        console.error("Error parsing user from localStorage:", e);
      }
    }
    axios
      .get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users`) 
      .then((res) => {
        const cleanUsers = res.data
        .map(user => ({
          id: user._id,
          name: user.username,
        }))
        console.log(cleanUsers);
        setUsers(cleanUsers);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      });
  }, []);
  
  console.log(author);
  console.log(dedicatedTo);
  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postsImages"); 

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const { secure_url, public_id } = res.data;
      return [secure_url, public_id]; // URL pública de la imagen
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return null;
    }
  };


  const handleAuraChange = (amount) => {
    setAura((prev) => prev + amount);
  };

  const canPost = aura !== 0 && description.trim() !== "" && dedicatedTo !== "";

  const { number } = useSpring({
    number: aura,
    from: { number: 0 },
    config: { tension: 170, friction: 26 },
  });

  

  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);

  const handlePost = async () => {
    setIsPosting(true);

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }
    console.log(imageUrl);
    const postData = {
      author: author,
      dedicatedTo: dedicatedTo,
      description,
      aura,
      image: imageUrl[0],
      imagePublicId: imageUrl[1],
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts`, postData); 
      router.replace("/posts");
    } catch (error) {
      
      if (imageUrl[1] != ""){
        await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}cloudinary/delete`, { public_id: imageUrl[1]} ); // endpoint para eliminar
      }
      console.error("Error al postear:", error);
      setIsPosting(false);
    }
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


      <div className="flex flex-col item-center justify-center gap-10 mb-6">
        {/* Suma */}
        <div className="flex justify-center gap-4">
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
        {/* Resta */}
        <div className="flex justify-center gap-4 mb-6">
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


            {imagePreview && (
        <div className="flex justify-center mb-4">
          <img src={imagePreview} alt="Preview" className="w-48 h-auto rounded shadow" />
        </div>
      )}

      <div className="mb-6 text-center">
        <label className="block mb-2 font-medium text-black dark:text-white">Subí una imagen</label>
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              setImageFile(file);
              setImagePreview(URL.createObjectURL(file));
            }
          }}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className={`inline-block px-5 py-2 rounded-full cursor-pointer font-semibold ${color[0]} text-white hover:opacity-90 transition`}
        >
          Elegir imagen
        </label>
      </div>

            <div className="mb-6">
        <label className="block mb-2 font-medium text-black dark:text-white">
          Elegí destinatario del aura
        </label>
        <select
          value={dedicatedTo}
          onChange={(e) => setDedicatedTo(e.target.value)}
          className="w-full p-3 rounded border dark:bg-gray-800 dark:text-white dark:border-gray-600 text-black"
        >
          <option value="" disabled>
            Seleccioná un usuario
          </option>
          {users.map((user, idx) => (
            <option key={user.id} value={user.id}>
              {user.name}
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
