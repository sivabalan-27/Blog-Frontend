import { useState, useEffect } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  // ⭐ NEW: store stats separately
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalLikes: 0,
    totalComments: 0,
  });

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const { userId } = useParams();
  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser || null);

      if (currentUser) {
        if (!userId || userId === currentUser.uid) {
          setIsOwnProfile(true);
          await fetchOwnProfile(currentUser);
        } else {
          setIsOwnProfile(false);
          await fetchPublicProfile(userId);
        }
      } else {
        if (userId) {
          await fetchPublicProfile(userId);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  // ⭐ FIXED: store stats separately
  const fetchOwnProfile = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken(true);

      const res = await axios.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProfile(res.data.profile);
      setProjects(res.data.projects || []);

      setStats({
        totalProjects: res.data.totalProjects,
        totalLikes: res.data.totalLikes,
        totalComments: res.data.totalComments,
      });
    } catch (err) {
      console.error("🔥 Error fetching own profile:", err);
    }
  };

  // ⭐ FIXED: store stats separately
  const fetchPublicProfile = async (uid) => {
    try {
      const res = await axios.get(`${API_BASE}/api/users/${uid}`);

      setProfile(res.data.profile);
      setProjects(res.data.projects || []);

      setStats({
        totalProjects: res.data.totalProjects,
        totalLikes: res.data.totalLikes,
        totalComments: res.data.totalComments,
      });
    } catch (err) {
      console.error("🔥 Error fetching public profile:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600">
        Loading profile...
      </div>
    );

  if (!profile)
    return (
      <div className="text-center mt-10 text-gray-500">
        User profile not found.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
        <p className="text-gray-600 mb-1">{profile.email}</p>
        <p className="text-gray-700 italic mb-4">
          {profile.bio || "No bio provided yet."}
        </p>

        {/* ⭐ FIXED: using values from stats */}
        <div className="flex gap-6 mb-3">
          <div>
            <h3 className="text-2xl font-bold text-blue-600">
              {stats.totalProjects}
            </h3>
            <p className="text-gray-500 text-sm">Projects</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-red-500">
              {stats.totalLikes}
            </h3>
            <p className="text-gray-500 text-sm">Likes</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-green-600">
              {stats.totalComments}
            </h3>
            <p className="text-gray-500 text-sm">Comments</p>
          </div>
        </div>

        {isOwnProfile && (
          <button
            onClick={() => navigate("/edit-profile")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            ✏️ Edit Profile
          </button>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-3">
        {isOwnProfile ? "My Projects" : `${profile.name}'s Projects`}
      </h2>

      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <div
              key={p._id}
              onClick={() => navigate(`/project/${p._id}`)}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer hover:bg-gray-50"
            >
              <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
              <p className="text-sm text-gray-600 mb-2">
                {p.description?.slice(0, 80)}...
              </p>
              <p className="text-xs text-gray-500">
                ❤️ {p.likes || 0} · 💬 {p.comments?.length || 0}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
