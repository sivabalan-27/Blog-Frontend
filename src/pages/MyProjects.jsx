import { useEffect, useState } from "react";
import axios from "axios";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import LikeButton from "../components/likeButton.";

function MyProjects() {
  const [projects, setProjects] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 🧭 Watch Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // 📦 Fetch user's own projects (from /api/projects/my)
  useEffect(() => {
    if (!user) return;

    const fetchMyProjects = async () => {
      try {
        const token = await user.getIdToken(true);
        const res = await axios.get(`${API_BASE}/api/projects/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("❌ Error fetching user projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyProjects();
  }, [user]);

  const handleDelete = async (id) => {
    if (!user) return alert("Please log in.");
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = await user.getIdToken(true);
      await axios.delete(`${API_BASE}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p._id !== id));
      alert("🗑️ Project deleted successfully.");
    } catch (err) {
      console.error("🔥 Error deleting project:", err);
      alert("Failed to delete project.");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading your blogs...
      </div>
    );

  if (!user)
    return (
      <div className="text-center text-gray-600 mt-10">
        Please log in to view your blogs.
      </div>
    );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Blogs</h1>

      {projects.length === 0 ? (
        <p className="text-gray-500">You haven’t added any blogs yet.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <div
              key={p._id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              onClick={() => navigate(`/project/${p._id}`)}
            >
              <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
              <p className="text-gray-700 mb-2 line-clamp-3">{p.description}</p>

              {/* Author info */}
              {p.authorName && (
                <div className="flex items-center gap-2 mb-2">
                  {p.authorPhoto && (
                    <img
                      src={p.authorPhoto}
                      alt={p.authorName}
                      className="w-6 h-6 rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-600">{p.authorName}</span>
                </div>
              )}

              <LikeButton
                projectId={p._id}
                initialLikes={p.likes || 0}
                initiallyLiked={p.likedByCurrentUser || false}
              />

              <div className="flex gap-2 mt-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/edit/${p._id}`);
                  }}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p._id);
                  }}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProjects;

