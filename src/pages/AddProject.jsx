// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";

// function AddProject() {
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     tags: "",
//     githubLink: "",
//     liveDemo: "",
//   });

//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [checkingProfile, setCheckingProfile] = useState(true);

//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   /* ============================================================
//       ✅ 1. CHECK USER PROFILE BEFORE SHOWING THE FORM
//      ============================================================== */
//   useEffect(() => {
//     const checkProfile = async () => {
//       const user = auth.currentUser;
//       if (!user) {
//         setError("⚠️ You must be logged in.");
//         setCheckingProfile(false);
//         return;
//       }

//       try {
//         const token = await user.getIdToken(true);
//         const res = await axios.get(`${API_BASE}/api/users/me`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const profile = res.data.profile;

//         // ❌ If profile is incomplete → STOP here & redirect
//         if (!profile.name || !profile.bio || profile.name.trim() === "" || profile.bio.trim() === "") {
//           alert("⚠️ Your profile is incomplete. Please complete it before adding a project.");
//           navigate("/profile/edit");
//           return;
//         }

//       } catch (err) {
//         console.error("🔥 Error checking profile:", err);
//         setError("Failed to verify profile.");
//       } finally {
//         setCheckingProfile(false);
//       }
//     };

//     checkProfile();
//   }, []);

//   /* ============================================================
//       📌 Handle Form Field Change
//      ============================================================== */
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   /* ============================================================
//       📌 Submit Project
//      ============================================================== */
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const user = auth.currentUser;

//     if (!user) {
//       setError("⚠️ You must be logged in to add a project.");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     const projectData = {
//       title: form.title,
//       description: form.description,
//       tags: form.tags ? form.tags.split(",").map((tag) => tag.trim()) : [],
//       githubLink: form.githubLink,
//       liveDemo: form.liveDemo,
//     };

//     try {
//       const token = await user.getIdToken(true);

//       await axios.post(`${API_BASE}/api/projects`, projectData, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       alert("✅ Project added successfully!");
//       navigate("/");
//     } catch (err) {
//       console.error("🔥 Error submitting project:", err);

//       if (err.response?.status === 403) {
//         alert(err.response.data.message);
//         navigate("/profile/edit");
//       } else {
//         setError("Failed to submit project. Try again.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ============================================================
//       ⏳ Loading State While Checking Profile
//      ============================================================== */
//   if (checkingProfile) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
//         Checking your profile...
//       </div>
//     );
//   }

//   /* ============================================================
//       🚀 Form UI
//      ============================================================== */
//   return (
//     <div className="max-w-lg mx-auto border rounded-lg shadow p-6 mt-8">
//       <h2 className="text-2xl font-bold mb-4 text-center">Add New Project</h2>

//       {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

//       <form onSubmit={handleSubmit} className="flex flex-col gap-3">
//         <input
//           type="text"
//           name="title"
//           placeholder="Project Title"
//           value={form.title}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           required
//         />

//         <textarea
//           name="description"
//           placeholder="Project Description"
//           value={form.description}
//           onChange={handleChange}
//           className="border p-2 rounded"
//           rows="4"
//           required
//         />

//         <input
//           type="text"
//           name="tags"
//           placeholder="Tags (comma separated)"
//           value={form.tags}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />

//         <input
//           type="url"
//           name="githubLink"
//           placeholder="GitHub Repository URL"
//           value={form.githubLink}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />

//         <input
//           type="url"
//           name="liveDemo"
//           placeholder="Live Demo URL"
//           value={form.liveDemo}
//           onChange={handleChange}
//           className="border p-2 rounded"
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className={`bg-blue-600 text-white font-semibold p-2 rounded hover:bg-blue-700 transition ${
//             loading ? "opacity-70 cursor-not-allowed" : ""
//           }`}
//         >
//           {loading ? "Submitting..." : "Submit Project"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default AddProject;

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
  const [loading, setLoading] =
    useState(false);

  const [checkingProfile, setCheckingProfile] =
    useState(true);

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Check User Profile
  useEffect(() => {
    const checkProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        setError(
          "⚠️ You must be logged in."
        );

        setCheckingProfile(false);
        return;
      }

      try {
        const token =
          await user.getIdToken(true);

        const res = await axios.get(
          `${API_BASE}/api/users/me`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const profile =
          res.data.profile;

        // Incomplete Profile
        if (
          !profile.name ||
          !profile.bio ||
          profile.name.trim() === "" ||
          profile.bio.trim() === ""
        ) {
          alert(
            "⚠️ Your profile is incomplete. Please complete it before adding a project."
          );

          navigate("/profile/edit");

          return;
        }
      } catch (err) {
        console.error(
          "🔥 Error checking profile:",
          err
        );

        setError(
          "Failed to verify profile."
        );
      } finally {
        setCheckingProfile(false);
      }
    };

    checkProfile();
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  };

  // Submit Project
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;

    if (!user) {
      setError(
        "⚠️ You must be logged in to add a project."
      );

      return;
    }

    setLoading(true);
    setError("");

    const projectData = {
      title: form.title,
      description:
        form.description,

      tags: form.tags
        ? form.tags
            .split(",")
            .map((tag) =>
              tag.trim()
            )
        : [],

      githubLink:
        form.githubLink,

      liveDemo: form.liveDemo,
    };

    try {
      const token =
        await user.getIdToken(true);

      await axios.post(
        `${API_BASE}/api/projects`,
        projectData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(
        "✅ Project added successfully!"
      );

      navigate("/");
    } catch (err) {
      console.error(
        "🔥 Error submitting project:",
        err
      );

      if (
        err.response?.status === 403
      ) {
        alert(
          err.response.data.message
        );

        navigate("/profile/edit");
      } else {
        setError(
          "Failed to submit project. Try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (checkingProfile) {
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
        Checking your profile...
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

      {/* Background Glow */}
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
              text-white
              tracking-tight
              mb-2
            "
          >
            Add New{" "}
            <span className="text-[#8B0023]">
              Project
            </span>
          </h2>

          <p className="text-gray-500">
            Share your work with the
            developer community.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              bg-[#6D001A]/15
              border border-[#6D001A]/30
              text-red-300
              rounded-2xl
              px-4 py-3
              mb-5
              text-sm
            "
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >

          {/* Title */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Project Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter project title"
              value={form.title}
              onChange={
                handleChange
              }
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
              placeholder="Describe your project..."
              value={
                form.description
              }
              onChange={
                handleChange
              }
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
              placeholder="React, Node.js, AI..."
              value={form.tags}
              onChange={
                handleChange
              }
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

          {/* GitHub + Live Demo */}
          <div className="grid md:grid-cols-2 gap-5">

            {/* GitHub */}
            <div className="flex flex-col gap-2">

              <label className="text-sm text-gray-400">
                GitHub Repository
              </label>

              <input
                type="url"
                name="githubLink"
                placeholder="https://github.com/..."
                value={
                  form.githubLink
                }
                onChange={
                  handleChange
                }
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
                placeholder="https://yourproject.com"
                value={form.liveDemo}
                onChange={
                  handleChange
                }
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
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
              ? "Submitting..."
              : "Publish Project"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddProject;