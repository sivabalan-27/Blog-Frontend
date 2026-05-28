import { useState, useEffect } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function RatingStars({
  projectId,
  initialRating = 0,
  userInitialRating = 0,
}) {
  const [rating, setRating] = useState(initialRating);
  const [userRating, setUserRating] =
    useState(userInitialRating);

  const [hover, setHover] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Watch auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsub();
  }, []);

  // Submit rating
  const handleRating = async (value) => {
    if (!user) {
      return alert("Please log in to rate this project.");
    }

    if (loading) return;

    setLoading(true);

    try {
      const token = await user.getIdToken();

      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/rate`,
        { value },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setRating(res.data.averageRating);
      setUserRating(res.data.userRating);
    } catch (err) {
      console.error(
        "🔥 Error submitting rating:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3 mt-4">

      {/* Stars */}
      <div className="flex items-center gap-1">

        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={(e) => {
              e.stopPropagation();
              handleRating(star);
            }}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(null)}
            disabled={loading}
            className={`
              text-2xl
              transition-all duration-300
              ${
                (hover || userRating) >= star
                  ? `
                    text-[#ff4d6d]
                    drop-shadow-[0_0_8px_rgba(109,0,26,0.6)]
                    scale-110
                  `
                  : `
                    text-gray-600
                    hover:text-[#ff4d6d]/70
                  `
              }
            `}
          >
            ★
          </button>
        ))}
      </div>

      {/* Rating Display */}
      <div className="
        bg-[#111111]
        border border-white/10
        px-3 py-1.5
        rounded-xl
      ">
        <span className="text-sm text-gray-300 font-medium">

          {rating ? (
            <>
              <span className="text-white">
                {rating.toFixed(1)}
              </span>
              <span className="text-gray-500">
                {" "}
                / 5
              </span>
            </>
          ) : (
            <span className="text-gray-500">
              No ratings
            </span>
          )}
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <span className="text-xs text-gray-500">
          Updating...
        </span>
      )}
    </div>
  );
}

export default RatingStars;