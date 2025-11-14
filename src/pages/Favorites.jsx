import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LikeButton from "../components/likeButton";
import FavoriteButton from "../components/FavoriteButton";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      try {
        const token = await user.getIdToken(true);
        const res = await axios.get(`${API_BASE}/api/projects/favorites/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("🔥 Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFavorites();
  }, [user]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading favorites...
      </div>
    );

  if (!user)
    return (
      <p className="text-center text-gray-600 mt-10">
        Please log in to view your favorites.
      </p>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">⭐ My Favorite Projects</h1>

      {favorites.length === 0 ? (
        <p className="text-gray-500">You haven't added any favorites yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((p) => (
            <div
              key={p._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
              onClick={() => navigate(`/project/${p._id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-gray-700 mb-2 line-clamp-3">
                {p.description}
              </p>

              <div
                className="flex items-center justify-between mt-2"
                onClick={(e) => e.stopPropagation()}
              >
                <LikeButton
                  projectId={p._id}
                  initialLikes={p.likes || 0}
                  initiallyLiked={p.likedByCurrentUser || false}
                />

                <FavoriteButton
                  projectId={p._id}
                  initiallyFavorited={true}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;
