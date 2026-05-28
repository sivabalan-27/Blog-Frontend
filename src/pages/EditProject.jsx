// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";

// function EditProject() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     tags: "",
//     githubLink: "",
//     liveDemo: "",
//   });

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   // ✅ Fetch project details correctly
//   useEffect(() => {
//     const fetchProject = async () => {
//       try {
//         const res = await axios.get(`${API_BASE}/api/projects/${id}`);
//         const project = res.data;

//         setForm({
//           title: project.title,
//           description: project.description,
//           tags: project.tags?.join(", ") || "",
//           githubLink: project.githubLink || "",
//           liveDemo: project.liveDemo || "",
//         });

//         setLoading(false);
//       } catch (err) {
//         console.error("🔥 Error fetching project:", err);
//         setError("Project not found or failed to load.");
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, [id]);

//   // 🔄 Update fields
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // 💾 Update project
//   const handleUpdate = async (e) => {
//     e.preventDefault();

//     const user = auth.currentUser;
//     if (!user) {
//       alert("Please log in to update this project.");
//       return;
//     }

//     setError("");
//     setLoading(true);

//     try {
//       const token = await user.getIdToken(true);

//       const updatedData = {
//         title: form.title,
//         description: form.description,
//         tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()) : [],
//         githubLink: form.githubLink,
//         liveDemo: form.liveDemo,
//       };

//       await axios.put(`${API_BASE}/api/projects/${id}`, updatedData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("✅ Project updated successfully!");
//       navigate(`/project/${id}`);
//     } catch (err) {
//       console.error("🔥 Error updating project:", err);
//       setError("Failed to update project.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
//         Loading project...
//       </div>
//     );

//   if (error)
//     return (
//       <div className="text-center text-red-500 mt-10 text-lg">{error}</div>
//     );

//   return (
//     <div className="max-w-lg mx-auto border rounded-lg shadow p-6 mt-8">
//       <h2 className="text-2xl font-bold mb-4 text-center">Edit Project</h2>

//       <form onSubmit={handleUpdate} className="flex flex-col gap-3">
//         <input
//           type="text"
//           name="title"
//           value={form.title}
//           onChange={handleChange}
//           placeholder="Project Title"
//           className="border p-2 rounded"
//           required
//         />

//         <textarea
//           name="description"
//           value={form.description}
//           onChange={handleChange}
//           placeholder="Project Description"
//           className="border p-2 rounded"
//           rows="4"
//           required
//         />

//         <input
//           type="text"
//           name="tags"
//           value={form.tags}
//           onChange={handleChange}
//           placeholder="Tags (comma separated)"
//           className="border p-2 rounded"
//         />

//         <input
//           type="url"
//           name="githubLink"
//           value={form.githubLink}
//           onChange={handleChange}
//           placeholder="GitHub Link"
//           className="border p-2 rounded"
//         />

//         <input
//           type="url"
//           name="liveDemo"
//           value={form.liveDemo}
//           onChange={handleChange}
//           placeholder="Live Demo Link"
//           className="border p-2 rounded"
//         />

//         <button
//           disabled={loading}
//           className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
//         >
//           {loading ? "Updating..." : "Update Project"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditProject;


import { useEffect, useState } from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { auth } from "../firebaseConfig";

function EditProject() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      tags: "",
      githubLink: "",
      liveDemo: "",
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Fetch Project
  useEffect(() => {
    const fetchProject =
      async () => {
        try {
          const res =
            await axios.get(
              `${API_BASE}/api/projects/${id}`
            );

          const project =
            res.data;

          setForm({
            title:
              project.title,
            description:
              project.description,

            tags:
              project.tags?.join(
                ", "
              ) || "",

            githubLink:
              project.githubLink ||
              "",

            liveDemo:
              project.liveDemo ||
              "",
          });

          setLoading(false);
        } catch (err) {
          console.error(
            "🔥 Error fetching project:",
            err
          );

          setError(
            "Project not found or failed to load."
          );

          setLoading(false);
        }
      };

    fetchProject();
  }, [id]);

  // Handle Change
  const handleChange = (
    e
  ) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // Update Project
  const handleUpdate =
    async (e) => {
      e.preventDefault();

      const user =
        auth.currentUser;

      if (!user) {
        alert(
          "Please log in to update this project."
        );

        return;
      }

      setError("");
      setLoading(true);

      try {
        const token =
          await user.getIdToken(
            true
          );

        const updatedData =
          {
            title:
              form.title,

            description:
              form.description,

            tags:
              form.tags
                ? form.tags
                    .split(",")
                    .map(
                      (
                        tag
                      ) =>
                        tag.trim()
                    )
                : [],

            githubLink:
              form.githubLink,

            liveDemo:
              form.liveDemo,
          };

        await axios.put(
          `${API_BASE}/api/projects/${id}`,
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "✅ Project updated successfully!"
        );

        navigate(
          `/project/${id}`
        );
      } catch (err) {
        console.error(
          "🔥 Error updating project:",
          err
        );

        setError(
          "Failed to update project."
        );
      } finally {
        setLoading(false);
      }
    };

  // Loading State
  if (loading) {
    return (
      <div
        className="
          min-h-screen
          bg-[#050505]
          flex items-center justify-center
          text-gray-400
          text-lg
        "
      >
        Loading project...
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div
        className="
          min-h-screen
          bg-[#050505]
          flex items-center justify-center
          px-6
        "
      >

        <div
          className="
            bg-[#111111]
            border border-[#6D001A]/30
            rounded-3xl
            p-8
            text-center
            max-w-md
            w-full
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              text-red-300
              mb-3
            "
          >
            Something Went Wrong
          </h2>

          <p className="text-gray-400">
            {error}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#050505]
        flex items-center justify-center
        px-6 py-10
        relative overflow-hidden
      "
    >

      {/* Glow */}
      <div
        className="
          absolute
          w-[500px]
          h-[500px]
          bg-[#6D001A]/20
          blur-[140px]
          rounded-full
        "
      />

      {/* Card */}
      <div
        className="
          relative
          w-full
          max-w-2xl
          bg-[#111111]/95
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        {/* Heading */}
        <div className="mb-8">

          <h2
            className="
              text-4xl
              font-extrabold
              tracking-tight
              mb-2
            "
          >
            Edit{" "}
            <span className="text-[#8B0023]">
              Project
            </span>
          </h2>

          <p className="text-gray-500">
            Update your project
            details and links.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={
            handleUpdate
          }
          className="
            flex flex-col
            gap-5
          "
        >

          {/* Title */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Project Title
            </label>

            <input
              type="text"
              name="title"
              value={
                form.title
              }
              onChange={
                handleChange
              }
              placeholder="Project Title"
              required
              className="
                bg-[#1a1a1a]
                border border-white/10
                rounded-2xl
                px-4 py-3
                text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:border-[#6D001A]
                focus:ring-2
                focus:ring-[#6D001A]/30
                transition-all
              "
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Description
            </label>

            <textarea
              name="description"
              value={
                form.description
              }
              onChange={
                handleChange
              }
              placeholder="Project Description"
              rows="5"
              required
              className="
                bg-[#1a1a1a]
                border border-white/10
                rounded-2xl
                px-4 py-3
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
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Tags
            </label>

            <input
              type="text"
              name="tags"
              value={
                form.tags
              }
              onChange={
                handleChange
              }
              placeholder="React, Node.js, AI..."
              className="
                bg-[#1a1a1a]
                border border-white/10
                rounded-2xl
                px-4 py-3
                text-white
                placeholder:text-gray-500
                focus:outline-none
                focus:border-[#6D001A]
                focus:ring-2
                focus:ring-[#6D001A]/30
                transition-all
              "
            />
          </div>

          {/* Links */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* GitHub */}
            <div className="flex flex-col gap-2">

              <label className="text-sm text-gray-400">
                GitHub Link
              </label>

              <input
                type="url"
                name="githubLink"
                value={
                  form.githubLink
                }
                onChange={
                  handleChange
                }
                placeholder="https://github.com/..."
                className="
                  bg-[#1a1a1a]
                  border border-white/10
                  rounded-2xl
                  px-4 py-3
                  text-white
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:border-[#6D001A]
                  focus:ring-2
                  focus:ring-[#6D001A]/30
                  transition-all
                "
              />
            </div>

            {/* Live Demo */}
            <div className="flex flex-col gap-2">

              <label className="text-sm text-gray-400">
                Live Demo
              </label>

              <input
                type="url"
                name="liveDemo"
                value={
                  form.liveDemo
                }
                onChange={
                  handleChange
                }
                placeholder="https://yourproject.com"
                className="
                  bg-[#1a1a1a]
                  border border-white/10
                  rounded-2xl
                  px-4 py-3
                  text-white
                  placeholder:text-gray-500
                  focus:outline-none
                  focus:border-[#6D001A]
                  focus:ring-2
                  focus:ring-[#6D001A]/30
                  transition-all
                "
              />
            </div>
          </div>

          {/* Submit */}
          <button
            disabled={
              loading
            }
            className={`
              mt-4
              py-4
              rounded-2xl
              text-white
              font-semibold
              transition-all duration-300
              ${
                loading
                  ? `
                    bg-[#3a0a14]
                    cursor-not-allowed
                  `
                  : `
                    bg-[#6D001A]
                    hover:bg-[#8B0023]
                    hover:shadow-[0_0_30px_rgba(109,0,26,0.45)]
                  `
              }
            `}
          >
            {loading
              ? "Updating..."
              : "Update Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProject;