import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Comments({ projectId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        setUser(currentUser);
      }
    );

    return () => unsubscribe();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/projects/${projectId}/comments`
        );

        setComments(res.data);
      } catch (err) {
        console.error(
          "❌ Error fetching comments:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [projectId]);

  // Add Comment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      return alert("Please log in to comment.");
    }

    if (!text.trim()) return;

    try {
      const token = await user.getIdToken();

      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/comments`,
        { text },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setComments(
        res.data.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        )
      );

      setText("");
    } catch (err) {
      console.error(
        "🔥 Error adding comment:",
        err
      );
    }
  };

  if (loading) {
    return (
      <p className="text-gray-500 text-sm mt-4">
        Loading comments...
      </p>
    );
  }

  return (
    <div className="mt-6 border-t border-white/10 pt-5">

      {/* Title */}
      <h3 className="text-xl font-semibold text-white mb-4">
        Comments
      </h3>

      {/* Comment Form */}
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 mb-6"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="
              bg-[#111111]
              border border-white/10
              rounded-2xl
              p-4
              text-sm
              text-white
              placeholder:text-gray-500
              focus:outline-none
              focus:border-[#6D001A]
              focus:ring-2
              focus:ring-[#6D001A]/30
              transition-all
              resize-none
            "
          />

          <button
            type="submit"
            className="
              self-end
              bg-[#6D001A]
              hover:bg-[#8B0023]
              px-5 py-2
              rounded-xl
              text-white
              text-sm
              font-medium
              transition-all duration-300
              shadow-lg
              hover:shadow-[0_0_20px_rgba(109,0,26,0.4)]
            "
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-500 text-sm mb-5">
          Please log in to post a comment.
        </p>
      )}

      {/* Empty State */}
      {comments.length === 0 ? (
        <div className="
          bg-[#111111]
          border border-white/10
          rounded-2xl
          p-6
          text-center
        ">
          <p className="text-gray-500 text-sm">
            No comments yet.
          </p>
        </div>
      ) : (
        <ul className="space-y-4">

          {comments.map((c) => (
            <li
              key={c._id}
              className="
                bg-[#111111]
                border border-white/10
                rounded-2xl
                p-4
                transition-all duration-300
                hover:border-[#6D001A]
                hover:shadow-[0_0_20px_rgba(109,0,26,0.15)]
              "
            >

              {/* User */}
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-white text-sm">
                  {c.userEmail}
                </p>

                <p className="text-xs text-gray-500">
                  {new Date(
                    c.createdAt
                  ).toLocaleString()}
                </p>
              </div>

              {/* Comment */}
              <p className="text-gray-300 text-sm leading-relaxed">
                {c.text}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;