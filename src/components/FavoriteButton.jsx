import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function FavoriteButton({
  projectId,
  initiallyFavorited = false,
}) {
  const [favorited, setFavorited] = useState(
    initiallyFavorited
  );

  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Track Firebase User
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsub();
  }, []);

  // Toggle Favorite
  const handleFavorite = async (e) => {
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
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setFavorited(res.data.favorited);
    } catch (err) {
      console.error(
        "🔥 Error toggling favorite:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className={`
        px-4 py-2 rounded-xl
        flex items-center gap-2
        text-sm font-medium
        border
        transition-all duration-300
        ${
          favorited
            ? `
              bg-[#6D001A]
              border-[#8B0023]
              text-white
              hover:bg-[#8B0023]
              hover:shadow-[0_0_20px_rgba(109,0,26,0.45)]
            `
            : `
              bg-[#111111]
              border-white/10
              text-gray-300
              hover:border-[#6D001A]
              hover:bg-[#1a1a1a]
              hover:text-white
              hover:shadow-[0_0_18px_rgba(109,0,26,0.25)]
            `
        }
      `}
    >
      {loading ? (
        "Processing..."
      ) : favorited ? (
        <>
          ⭐ <span>Favorited</span>
        </>
      ) : (
        <>
          ☆ <span>Favorite</span>
        </>
      )}
    </button>
  );
}

export default FavoriteButton;