import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function LikeButton({ projectId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Sync likes if parent updates
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes, projectId]);

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);

        if (currentUser && projectId) {
          try {
            const token = await currentUser.getIdToken();

            const res = await axios.get(
              `${API_BASE}/api/projects/${projectId}`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

            const likedByUser =
              res.data?.likedBy?.includes(currentUser.uid);

            setLiked(!!likedByUser);
          } catch (err) {
            console.warn(
              "⚠️ Could not check like status:",
              err.message
            );
          }
        } else {
          setLiked(false);
        }
      }
    );

    return () => unsubscribe();
  }, [projectId]);

  const handleLike = async (e) => {
    e.stopPropagation();

    if (!user) {
      alert("Please log in to like this project.");
      return;
    }

    if (!projectId) {
      console.error("❌ Missing projectId prop!");
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      const token = await user.getIdToken();

      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data && typeof res.data.likes === "number") {
        setLikes(res.data.likes);
        setLiked(res.data.liked);
      }
    } catch (err) {
      console.error("❌ Error liking project:", err);

      if (err?.response?.status === 401) {
        alert("Session expired. Please log in again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-3">

      {/* Like Button */}
      <button
        onClick={handleLike}
        disabled={!user || loading || !projectId}
        className={`
          px-4 py-2 rounded-xl flex items-center gap-2
          text-sm font-medium
          transition-all duration-300
          border
          ${
            user && projectId && !loading
              ? liked
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
                  hover:text-white
                  hover:bg-[#1a1a1a]
                  hover:shadow-[0_0_18px_rgba(109,0,26,0.25)]
                `
              : `
                bg-[#1a1a1a]
                border-white/5
                text-gray-500
                cursor-not-allowed
              `
          }
        `}
      >
        {loading ? (
          "Processing..."
        ) : liked ? (
          <>
            ❤️ <span>Liked</span>
          </>
        ) : (
          <>
            🤍 <span>Like</span>
          </>
        )}
      </button>

      {/* Like Count */}
      <span className="text-sm text-gray-400 font-medium">
        <span className="text-white">{likes}</span>{" "}
        {likes === 1 ? "like" : "likes"}
      </span>
    </div>
  );
}

export default LikeButton;
