"use client";
import { useState, useEffect } from "react";
import Navbar from "../app/components/Navbar";
import { useSpring, animated } from '@react-spring/web';
import { useRouter } from "next/navigation";
import axios from "axios";
import RootLayout from "@/app/layout";

export default function PostAura() {
  const auraLevel = 1000;
  const [aura, setAura] = useState(0);
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [author, setAuthor] = useState("");
  const [users, setUsers] = useState([]);
  const [dedicatedTo, setDedicatedTo] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const router = useRouter();

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

    axios.get(`${process.env.NEXT_PUBLIC_URL_BACKEND}users`)
      .then((res) => {
        const cleanUsers = res.data.map(user => ({
          id: user._id,
          name: user.username,
        }));
        setUsers(cleanUsers);
      })
      .catch((error) => {
        console.error("Error al obtener usuarios:", error);
      });
  }, []);

  const uploadImageToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "postsImages");

    try {
      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      const { secure_url, public_id } = res.data;
      return [secure_url, public_id];
    } catch (error) {
      console.error("Error al subir imagen:", error);
      return [null, null];
    }
  };

  const handleAuraChange = (amount) => {
    setAura((prev) => prev + amount);
  };

  const canPost = aura !== 0 && description.trim() !== "" && dedicatedTo !== "" && imageFile !== null;

  const { number } = useSpring({
    number: aura,
    from: { number: 0 },
    config: { tension: 170, friction: 26 },
  });

  const handlePost = async () => {
    setIsPosting(true);

    let imageUrl = [null, null];
    if (imageFile) {
      imageUrl = await uploadImageToCloudinary(imageFile);
    }

    const postData = {
      author,
      dedicatedTo,
      description,
      aura,
      image: imageUrl[0],
      imagePublicId: imageUrl[1],
      auraImpactApplied: isPrivate,
    };

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}posts`, postData);

      if (isPrivate) {
        await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}users/${dedicatedTo}/aura`, {
          aura: aura
        });
      }

      router.replace("/posts");
    } catch (error) {
      if (imageUrl[1]) {
        await axios.post(`${process.env.NEXT_PUBLIC_URL_BACKEND}cloudinary/delete`, {
          public_id: imageUrl[1]
        });
      }
      console.error("Error al postear:", error);
      setIsPosting(false);
    }
  };
  return (
    <div className="min-h-screen p-6 bg-neutral-50 dark:bg-neutral-900">
      <Navbar />
      <h1 className="text-center text-2xl font-bold mt-10 mb-6 dark:text-white text-black">
        Ajuste de Aura
      </h1>

      <div className="text-6xl font-bold text-center mb-6 dark:text-white text-black">
        <animated.span>{number.to((n) => Math.floor(n))}</animated.span>
      </div>

      {/* Botones de suma */}
      <div className="flex flex-col item-center justify-center gap-10 mb-6">
        <div className="flex justify-center gap-4">
          {[50, 100, 500].map((val) => (
            <button
              key={`add-${val}`}
              onClick={() => handleAuraChange(val)}
              className="cursor-pointer bg-indigo-600 text-white font-semibold px-5 py-2 rounded-full hover:bg-indigo-700"
            >
              +{val}
            </button>
          ))}
        </div>
      </div>

      {/* Botones de resta */}
      <div className="flex justify-center gap-4 mb-6">
        {[50, 100, 500].map((val) => (
          <button
            key={`sub-${val}`}
            onClick={() => handleAuraChange(-val)}
            className="cursor-pointer border-2 border-indigo-600 text-indigo-600 font-semibold px-5 py-2 rounded-full bg-transparent hover:bg-indigo-900 hover:text-white"
          >
            -{val}
          </button>
        ))}
      </div>

      {/* Imagen */}
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
          className="inline-block px-5 py-2 rounded-full cursor-pointer font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition"
        >
          Elegir imagen
        </label>
      </div>

      {/* Select de destinatario */}
      <div className="mb-6 max-w-xl mx-auto w-full">
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
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div className="mb-6 max-w-xl mx-auto w-full">
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

      {/* Switch */}
      <div className="flex justify-center items-center gap-3 mb-6">
        <div
          onClick={() => setIsPrivate(!isPrivate)}
          className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
            isPrivate ? "bg-indigo-600" : "bg-gray-300 border border-gray-400"
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

      {/* Botón de postear + loading */}
      <div className="flex justify-center items-center relative mt-4">
        <button
          onClick={handlePost}
          disabled={!canPost || isPosting}
          className={`cursor-pointer px-6 py-3 rounded font-bold ${
            canPost && !isPosting
              ? "bg-indigo-600 text-white hover:bg-indigo-700"
              : "bg-gray-400 text-white cursor-not-allowed"
          }`}
        >
          Postear
        </button>

        {isPosting && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
