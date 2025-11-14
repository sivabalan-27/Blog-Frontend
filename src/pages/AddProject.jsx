import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

function AddProject() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    githubLink: "",
    liveDemo: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingProfile, setCheckingProfile] = useState(true);

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  /* ============================================================
      ✅ 1. CHECK USER PROFILE BEFORE SHOWING THE FORM
     ============================================================== */
  useEffect(() => {
    const checkProfile = async () => {
      const user = auth.currentUser;
      if (!user) {
        setError("⚠️ You must be logged in.");
        setCheckingProfile(false);
        return;
      }

      try {
        const token = await user.getIdToken(true);
        const res = await axios.get(`${API_BASE}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const profile = res.data.profile;

        // ❌ If profile is incomplete → STOP here & redirect
        if (!profile.name || !profile.bio || profile.name.trim() === "" || profile.bio.trim() === "") {
          alert("⚠️ Your profile is incomplete. Please complete it before adding a project.");
          navigate("/profile/edit");
          return;
        }

      } catch (err) {
        console.error("🔥 Error checking profile:", err);
        setError("Failed to verify profile.");
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, []);

  /* ============================================================
      📌 Handle Form Field Change
     ============================================================== */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ============================================================
      📌 Submit Project
     ============================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      setError("⚠️ You must be logged in to add a project.");
      return;
    }

    setLoading(true);
    setError("");

    const projectData = {
      title: form.title,
      description: form.description,
      tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()) : [],
      githubLink: form.githubLink,
      liveDemo: form.liveDemo,
    };

    try {
      const token = await user.getIdToken(true);

      await axios.post(`${API_BASE}/api/projects`, projectData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Project added successfully!");
      navigate("/");
    } catch (err) {
      console.error("🔥 Error submitting project:", err);

      if (err.response?.status === 403) {
        alert(err.response.data.message);
        navigate("/profile/edit");
      } else {
        setError("Failed to submit project. Try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  /* ============================================================
      ⏳ Loading State While Checking Profile
     ============================================================== */
  if (checkingProfile) {
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Checking your profile...
      </div>
    );
  }

  /* ============================================================
      🚀 Form UI
     ============================================================== */
  return (
    <div className="max-w-lg mx-auto border rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Add New Project</h2>

      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          placeholder="Project Description"
          value={form.description}
          onChange={handleChange}
          className="border p-2 rounded"
          rows="4"
          required
        />

        <input
          type="text"
          name="tags"
          placeholder="Tags (comma separated)"
          value={form.tags}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="url"
          name="githubLink"
          placeholder="GitHub Repository URL"
          value={form.githubLink}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <input
          type="url"
          name="liveDemo"
          placeholder="Live Demo URL"
          value={form.liveDemo}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className={`bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700 transition ${
            loading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Submitting..." : "Submit Project"}
        </button>
      </form>
    </div>
  );
}

export default AddProject;
