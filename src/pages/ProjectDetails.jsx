import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import LikeButton from "../components/likeButton.";
import FavoriteButton from "../components/FavoriteButton";
import RatingStars from "../components/RatingStars";
import Comments from "../components/Comments";

function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // 🧭 Track Firebase auth state
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser || null);
    });
    return () => unsub();
  }, []);

  // 📦 Fetch project details (includes likes, favorites, ratings, comments)
  useEffect(() => {
    if (user === undefined) return;

    const fetchProject = async () => {
      try {
        let headers = {};
        if (user) {
          const token = await user.getIdToken(true);
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await axios.get(`${API_BASE}/api/projects/${id}`, { headers });
        setProject(res.data);
      } catch (err) {
        console.error("🔥 Error fetching project details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id, user]);

  if (loading || user === undefined)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading project...
      </div>
    );

  if (!project)
    return <p className="text-center text-gray-600 mt-10">Project not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* 👤 Author Info (clickable) */}
      <div
        className="flex items-center gap-3 mb-5 cursor-pointer"
        onClick={() => {
          if (project.userId === user?.uid) navigate("/profile");
          else if (project.userId) navigate(`/profile/${project.userId}`);
        }}
      >
        {project.authorPhoto ? (
          <img
            src={project.authorPhoto}
            alt={project.authorName}
            className="w-10 h-10 rounded-full object-cover border"
          />
        ) : (
          <div className="w-10 h-10 bg-gray-300 rounded-full" />
        )}

        <div>
          <h3 className="text-md font-semibold text-blue-600 hover:underline">
            {project.authorName || "Anonymous User"}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(project.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* 📝 Project Info */}
      <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>

      {/* 🏷️ Tags */}
      {project.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-sm bg-gray-200 px-2 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* ❤️ Like / ⭐ Favorite / ⭐ Rating */}
      <div className="flex items-center gap-4 mb-5">
        <LikeButton
          projectId={project._id}
          initialLikes={project.likes || 0}
          initiallyLiked={project.likedByCurrentUser || false}
        />

        <FavoriteButton
          projectId={project._id}
          initiallyFavorited={project.favoritedByCurrentUser || false}
        />

        <RatingStars
          projectId={project._id}
          initialRating={project.averageRating || 0}
          userInitialRating={project.userRating || 0}
        />
      </div>

      {/* 🔗 Links */}
      {project.githubLink && (
        <a
          href={project.githubLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-1"
        >
          🔗 GitHub
        </a>
      )}

      {project.liveDemo && (
        <a
          href={project.liveDemo}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline block mb-5"
        >
          🚀 Live Demo
        </a>
      )}

      {/* 💬 Comments */}
      <div className="mt-8">
        <Comments projectId={project._id} />
      </div>
    </div>
  );
}

export default ProjectDetails;
