import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

function Comments({ projectId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // Watch auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Fetch comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects/${projectId}/comments`);
        setComments(res.data);
      } catch (err) {
        console.error("❌ Error fetching comments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, [projectId]);

  // Add new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please log in to comment.");
    if (!text.trim()) return;

    try {
      const token = await user.getIdToken();
      const res = await axios.post(
        `${API_BASE}/api/projects/${projectId}/comments`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setComments(res.data.sort((a, b) => b.createdAt - a.createdAt));
      setText("");
    } catch (err) {
      console.error("🔥 Error adding comment:", err);
    }
  };

  if (loading) return <p className="text-gray-500 text-sm">Loading comments...</p>;

  return (
    <div className="mt-4 border-t pt-3">
      <h3 className="text-lg font-semibold mb-2">Comments</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-3">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write a comment..."
            className="border rounded p-2 text-sm"
            rows={2}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 self-end"
          >
            Post Comment
          </button>
        </form>
      ) : (
        <p className="text-gray-600 text-sm mb-3">
          Please log in to post a comment.
        </p>
      )}

      {comments.length === 0 ? (
        <p className="text-gray-500 text-sm">No comments yet.</p>
      ) : (
        <ul className="space-y-2">
          {comments.map((c) => (
            <li key={c._id} className="bg-gray-50 p-2 rounded text-sm border">
              <p className="font-semibold text-gray-800">{c.userEmail}</p>
              <p className="text-gray-700">{c.text}</p>
              <p className="text-xs text-gray-400">
                {new Date(c.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Comments;
