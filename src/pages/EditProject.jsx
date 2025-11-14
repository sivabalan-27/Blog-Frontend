import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";

function EditProject() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    tags: "",
    githubLink: "",
    liveDemo: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  // ✅ Fetch project details correctly
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/projects/${id}`);
        const project = res.data;

        setForm({
          title: project.title,
          description: project.description,
          tags: project.tags?.join(", ") || "",
          githubLink: project.githubLink || "",
          liveDemo: project.liveDemo || "",
        });

        setLoading(false);
      } catch (err) {
        console.error("🔥 Error fetching project:", err);
        setError("Project not found or failed to load.");
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // 🔄 Update fields
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 💾 Update project
  const handleUpdate = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to update this project.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const token = await user.getIdToken(true);

      const updatedData = {
        title: form.title,
        description: form.description,
        tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()) : [],
        githubLink: form.githubLink,
        liveDemo: form.liveDemo,
      };

      await axios.put(`${API_BASE}/api/projects/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Project updated successfully!");
      navigate(`/project/${id}`);
    } catch (err) {
      console.error("🔥 Error updating project:", err);
      setError("Failed to update project.");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
        Loading project...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 mt-10 text-lg">{error}</div>
    );

  return (
    <div className="max-w-lg mx-auto border rounded-lg shadow p-6 mt-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Project</h2>

      <form onSubmit={handleUpdate} className="flex flex-col gap-3">
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Project Title"
          className="border p-2 rounded"
          required
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Project Description"
          className="border p-2 rounded"
          rows="4"
          required
        />

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="border p-2 rounded"
        />

        <input
          type="url"
          name="githubLink"
          value={form.githubLink}
          onChange={handleChange}
          placeholder="GitHub Link"
          className="border p-2 rounded"
        />

        <input
          type="url"
          name="liveDemo"
          value={form.liveDemo}
          onChange={handleChange}
          placeholder="Live Demo Link"
          className="border p-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Updating..." : "Update Project"}
        </button>
      </form>
    </div>
  );
}

export default EditProject;
