import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function LikeButton({ projectId, initialLikes = 0 }) {
  const [likes, setLikes] = useState(initialLikes);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false); // 🔥 track whether current user liked this project

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Keep likes updated if parent prop changes
  useEffect(() => {
    setLikes(initialLikes);
  }, [initialLikes, projectId]);

  // Watch Firebase auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser && projectId) {
        try {
          const token = await currentUser.getIdToken();
          const res = await axios.get(`${API_BASE}/api/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const likedByUser = res.data?.likedBy?.includes(currentUser.uid);
          setLiked(!!likedByUser);
        } catch (err) {
          console.warn("⚠️ Could not check like status:", err.message);
        }
      } else {
        setLiked(false);
      }
    });
    return () => unsubscribe();
  }, [projectId]);

  const handleLike = async (e) => {
    e.stopPropagation(); // 🧱 prevent card navigation when clicking Like

    if (!user) {
      alert("Please log in to like this project.");
      return;
    }

    if (!projectId) {
      console.error("❌ Missing projectId prop in LikeButton!");
      return;
    }

    if (loading) return; // prevent spamming

    setLoading(true);

    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data && typeof res.data.likes === "number") {
        setLikes(res.data.likes);
        setLiked(res.data.liked); // ✅ toggle based on server response
      } else {
        console.warn("⚠️ Unexpected response:", res.data);
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
    <div className="flex items-center gap-2 mt-2">
      <button
        onClick={handleLike}
        disabled={!user || loading || !projectId}
        className={`px-3 py-1 rounded-md flex items-center gap-1 transition-all duration-200 ${
          user && projectId && !loading
            ? liked
              ? "bg-red-500 hover:bg-red-600 text-white" // ❤️ Unlike button style
              : "bg-blue-500 hover:bg-blue-600 text-white" // 👍 Like button style
            : "bg-gray-400 text-gray-200 cursor-not-allowed"
        }`}
      >
        {loading ? "Processing..." : liked ? "Unlike" : "Like"}
      </button>
      <span className="text-sm text-gray-700">
        {likes} {likes === 1 ? "like" : "likes"}
      </span>
    </div>
  );
}

export default LikeButton;
