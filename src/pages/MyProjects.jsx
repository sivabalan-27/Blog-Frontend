// import { useEffect, useState } from "react";
// import axios from "axios";
// import { auth } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import LikeButton from "../components/likeButton";

// function MyProjects() {
//   const [projects, setProjects] = useState([]);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   // 🧭 Watch Firebase user
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   // 📦 Fetch user's own projects (from /api/projects/my)
//   useEffect(() => {
//     if (!user) return;

//     const fetchMyProjects = async () => {
//       try {
//         const token = await user.getIdToken(true);
//         const res = await axios.get(`${API_BASE}/api/projects/my`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setProjects(res.data);
//       } catch (err) {
//         console.error("❌ Error fetching user projects:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchMyProjects();
//   }, [user]);

//   const handleDelete = async (id) => {
//     if (!user) return alert("Please log in.");
//     if (!window.confirm("Are you sure you want to delete this project?")) return;

//     try {
//       const token = await user.getIdToken(true);
//       await axios.delete(`${API_BASE}/api/projects/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProjects(projects.filter((p) => p._id !== id));
//       alert("🗑️ Project deleted successfully.");
//     } catch (err) {
//       console.error("🔥 Error deleting project:", err);
//       alert("Failed to delete project.");
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
//         Loading your blogs...
//       </div>
//     );

//   if (!user)
//     return (
//       <div className="text-center text-gray-600 mt-10">
//         Please log in to view your blogs.
//       </div>
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">My Blogs</h1>

//       {projects.length === 0 ? (
//         <p className="text-gray-500">You haven’t added any blogs yet.</p>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {projects.map((p) => (
//             <div
//               key={p._id}
//               className="p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
//               onClick={() => navigate(`/project/${p._id}`)}
//             >
//               <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
//               <p className="text-gray-700 mb-2 line-clamp-3">{p.description}</p>

//               {/* Author info */}
//               {p.authorName && (
//                 <div className="flex items-center gap-2 mb-2">
//                   {p.authorPhoto && (
//                     <img
//                       src={p.authorPhoto}
//                       alt={p.authorName}
//                       className="w-6 h-6 rounded-full"
//                     />
//                   )}
//                   <span className="text-sm text-gray-600">{p.authorName}</span>
//                 </div>
//               )}

//               <LikeButton
//                 projectId={p._id}
//                 initialLikes={p.likes || 0}
//                 initiallyLiked={p.likedByCurrentUser || false}
//               />

//               <div className="flex gap-2 mt-3">
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(`/edit/${p._id}`);
//                   }}
//                   className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     handleDelete(p._id);
//                   }}
//                   className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default MyProjects;

import { useEffect, useState } from "react";

import axios from "axios";

import { auth } from "../firebaseConfig";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  useNavigate,
} from "react-router-dom";

import LikeButton from "../components/likeButton";

function MyProjects() {
  const [projects, setProjects] =
    useState([]);

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Watch Firebase User
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(
            currentUser
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // Fetch User Projects
  useEffect(() => {
    if (!user) return;

    const fetchMyProjects =
      async () => {
        try {
          const token =
            await user.getIdToken(
              true
            );

          const res =
            await axios.get(
              `${API_BASE}/api/projects/my`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setProjects(
            res.data
          );
        } catch (err) {
          console.error(
            "❌ Error fetching user projects:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchMyProjects();
  }, [user]);

  // Delete Project
  const handleDelete =
    async (id) => {
      if (!user) {
        return alert(
          "Please log in."
        );
      }

      if (
        !window.confirm(
          "Are you sure you want to delete this project?"
        )
      )
        return;

      try {
        const token =
          await user.getIdToken(
            true
          );

        await axios.delete(
          `${API_BASE}/api/projects/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setProjects(
          projects.filter(
            (p) =>
              p._id !== id
          )
        );

        alert(
          "🗑️ Project deleted successfully."
        );
      } catch (err) {
        console.error(
          "🔥 Error deleting project:",
          err
        );

        alert(
          "Failed to delete project."
        );
      }
    };

  // Loading
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
        Loading your projects...
      </div>
    );
  }

  // Not Logged In
  if (!user) {
    return (
      <div
        className="
          min-h-screen
          bg-[#050505]
          flex items-center justify-center
          text-gray-500
          text-lg
        "
      >
        Please log in to view your
        projects.
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#050505]
        text-white
        px-6 py-10
      "
    >

      {/* Header */}
      <div
        className="
          flex flex-col md:flex-row
          md:items-center
          md:justify-between
          gap-5
          mb-10
        "
      >

        <div>

          <h1
            className="
              text-5xl
              font-black
              tracking-tight
              mb-2
            "
          >
            My{" "}
            <span className="text-[#8B0023]">
              Projects
            </span>
          </h1>

          <p className="text-gray-500">
            Manage and monitor your
            published work.
          </p>
        </div>

        {/* Add Project Button */}
        <button
          onClick={() =>
            navigate("/add")
          }
          className="
            bg-[#6D001A]
            hover:bg-[#8B0023]
            px-6 py-3
            rounded-2xl
            text-white
            font-medium
            transition-all duration-300
            hover:shadow-[0_0_30px_rgba(109,0,26,0.45)]
          "
        >
          + Add New Project
        </button>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
        <div
          className="
            bg-[#111111]
            border border-white/10
            rounded-3xl
            p-12
            text-center
          "
        >

          <h2
            className="
              text-2xl
              font-bold
              mb-3
            "
          >
            No Projects Yet
          </h2>

          <p className="text-gray-500 mb-6">
            Start sharing your work
            with the developer
            community.
          </p>

          <button
            onClick={() =>
              navigate("/add")
            }
            className="
              bg-[#6D001A]
              hover:bg-[#8B0023]
              px-6 py-3
              rounded-2xl
              transition-all duration-300
            "
          >
            Add Project
          </button>
        </div>
      ) : (
        <div
          className="
            grid
            md:grid-cols-2
            xl:grid-cols-3
            gap-6
          "
        >

          {projects.map((p) => (
            <div
              key={p._id}
              onClick={() =>
                navigate(
                  `/project/${p._id}`
                )
              }
              className="
                group
                bg-[#111111]
                border border-white/10
                rounded-3xl
                p-5
                cursor-pointer
                transition-all duration-300
                hover:border-[#6D001A]
                hover:shadow-[0_0_30px_rgba(109,0,26,0.18)]
                hover:-translate-y-1
              "
            >

              {/* Thumbnail */}
              <div
                className="
                  h-[200px]
                  rounded-2xl
                  bg-gradient-to-br
                  from-[#1a1a1a]
                  to-[#0f0f0f]
                  border border-white/5
                  mb-5
                  flex items-center justify-center
                "
              >
                <span className="text-gray-600 text-sm">
                  Project Preview
                </span>
              </div>

              {/* Title */}
              <h2
                className="
                  text-2xl
                  font-bold
                  mb-3
                  group-hover:text-[#ff4d6d]
                  transition-all
                "
              >
                {p.title}
              </h2>

              {/* Description */}
              <p
                className="
                  text-gray-400
                  text-sm
                  leading-relaxed
                  line-clamp-3
                  mb-5
                "
              >
                {p.description}
              </p>

              {/* Author */}
              {p.authorName && (
                <div
                  className="
                    flex items-center
                    gap-3
                    mb-5
                  "
                >

                  {p.authorPhoto ? (
                    <img
                      src={
                        p.authorPhoto
                      }
                      alt={
                        p.authorName
                      }
                      className="
                        w-9 h-9
                        rounded-full
                        object-cover
                        border border-white/10
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-9 h-9
                        rounded-full
                        bg-[#1a1a1a]
                        border border-white/10
                      "
                    />
                  )}

                  <span
                    className="
                      text-sm
                      text-gray-400
                    "
                  >
                    {p.authorName}
                  </span>
                </div>
              )}

              {/* Likes */}
              <div className="mb-5">
                <LikeButton
                  projectId={
                    p._id
                  }
                  initialLikes={
                    p.likes || 0
                  }
                  initiallyLiked={
                    p.likedByCurrentUser ||
                    false
                  }
                />
              </div>

              {/* Actions */}
              <div
                className="
                  flex items-center
                  gap-3
                "
              >

                {/* Edit */}
                <button
                  onClick={(
                    e
                  ) => {
                    e.stopPropagation();

                    navigate(
                      `/edit/${p._id}`
                    );
                  }}
                  className="
                    flex-1
                    bg-[#1a1a1a]
                    border border-white/10
                    hover:border-[#6D001A]
                    hover:bg-[#151515]
                    px-4 py-3
                    rounded-2xl
                    text-gray-300
                    hover:text-white
                    transition-all duration-300
                  "
                >
                  Edit
                </button>

                {/* Delete */}
                <button
                  onClick={(
                    e
                  ) => {
                    e.stopPropagation();

                    handleDelete(
                      p._id
                    );
                  }}
                  className="
                    flex-1
                    bg-[#6D001A]
                    hover:bg-[#8B0023]
                    px-4 py-3
                    rounded-2xl
                    text-white
                    transition-all duration-300
                    hover:shadow-[0_0_20px_rgba(109,0,26,0.35)]
                  "
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