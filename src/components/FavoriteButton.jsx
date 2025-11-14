import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function FavoriteButton({ projectId, initiallyFavorited = false }) {
  const [favorited, setFavorited] = useState(initiallyFavorited);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 👤 Track Firebase user
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  // ⭐ Toggle favorite
  const handleFavorite = async (e) => {
    // 🛑 Prevent click from opening project details
    e.stopPropagation();

    if (!user) {
      alert("Please log in to add favorites.");
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Toggle based on server response
      setFavorited(res.data.favorited);
    } catch (err) {
      console.error("🔥 Error toggling favorite:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className={`px-3 py-1 rounded-md flex items-center gap-1 transition-all duration-200 ${
        favorited
          ? "bg-yellow-500 hover:bg-yellow-600 text-white"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
    >
      {loading
        ? "Processing..."
        : favorited
        ? "★ Favorited"
        : "☆ Favorite"}
    </button>
  );
}

export default FavoriteButton;
