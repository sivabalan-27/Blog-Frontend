import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function RatingStars({ projectId, initialRating = 0, userInitialRating = 0 }) {
  const [rating, setRating] = useState(initialRating);
  const [userRating, setUserRating] = useState(userInitialRating);
  const [hover, setHover] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);

  const handleRating = async (value) => {
    if (!user) return alert("Please log in to rate this blog.");
    if (loading) return;

    setLoading(true);
    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/rate`,
        { value },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRating(res.data.averageRating);
      setUserRating(res.data.userRating);
    } catch (err) {
      console.error("🔥 Error submitting rating:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center mt-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={(e) => {
            e.stopPropagation();
            handleRating(star);
          }}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          className={`text-2xl transition-colors ${
            (hover || userRating) >= star ? "text-yellow-400" : "text-gray-300"
          }`}
        >
          ★
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-700">
        {rating ? `${rating.toFixed(1)} / 5` : "No rating yet"}
      </span>
    </div>
  );
}

export default RatingStars;
