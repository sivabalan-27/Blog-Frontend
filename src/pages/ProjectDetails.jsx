// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useNavigate } from "react-router-dom";
// import { auth } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import LikeButton from "../components/likeButton";
// import FavoriteButton from "../components/FavoriteButton";
// import RatingStars from "../components/RatingStars";
// import Comments from "../components/Comments";

// function ProjectDetails() {
//   const { id } = useParams();
//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(undefined);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   // 🧭 Track Firebase auth state
//   useEffect(() => {
//     const unsub = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser || null);
//     });
//     return () => unsub();
//   }, []);

//   // 📦 Fetch project details (includes likes, favorites, ratings, comments)
//   useEffect(() => {
//     if (user === undefined) return;

//     const fetchProject = async () => {
//       try {
//         let headers = {};
//         if (user) {
//           const token = await user.getIdToken(true);
//           headers.Authorization = `Bearer ${token}`;
//         }

//         const res = await axios.get(`${API_BASE}/api/projects/${id}`, { headers });
//         setProject(res.data);
//       } catch (err) {
//         console.error("🔥 Error fetching project details:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProject();
//   }, [id, user]);

//   if (loading || user === undefined)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
//         Loading project...
//       </div>
//     );

//   if (!project)
//     return <p className="text-center text-gray-600 mt-10">Project not found.</p>;

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       {/* 👤 Author Info (clickable) */}
//       <div
//         className="flex items-center gap-3 mb-5 cursor-pointer"
//         onClick={() => {
//           if (project.userId === user?.uid) navigate("/profile");
//           else if (project.userId) navigate(`/profile/${project.userId}`);
//         }}
//       >
//         {project.authorPhoto ? (
//           <img
//             src={project.authorPhoto}
//             alt={project.authorName}
//             className="w-10 h-10 rounded-full object-cover border"
//           />
//         ) : (
//           <div className="w-10 h-10 bg-gray-300 rounded-full" />
//         )}

//         <div>
//           <h3 className="text-md font-semibold text-blue-600 hover:underline">
//             {project.authorName || "Anonymous User"}
//           </h3>
//           <p className="text-sm text-gray-500">
//             {new Date(project.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//       </div>

//       {/* 📝 Project Info */}
//       <h1 className="text-3xl font-bold mb-2">{project.title}</h1>
//       <p className="text-gray-700 mb-4 leading-relaxed">{project.description}</p>

//       {/* 🏷️ Tags */}
//       {project.tags?.length > 0 && (
//         <div className="flex flex-wrap gap-2 mb-4">
//           {project.tags.map((tag, idx) => (
//             <span
//               key={idx}
//               className="text-sm bg-gray-200 px-2 py-1 rounded-full"
//             >
//               #{tag}
//             </span>
//           ))}
//         </div>
//       )}

//       {/* ❤️ Like / ⭐ Favorite / ⭐ Rating */}
//       <div className="flex items-center gap-4 mb-5">
//         <LikeButton
//           projectId={project._id}
//           initialLikes={project.likes || 0}
//           initiallyLiked={project.likedByCurrentUser || false}
//         />

//         <FavoriteButton
//           projectId={project._id}
//           initiallyFavorited={project.favoritedByCurrentUser || false}
//         />

//         <RatingStars
//           projectId={project._id}
//           initialRating={project.averageRating || 0}
//           userInitialRating={project.userRating || 0}
//         />
//       </div>

//       {/* 🔗 Links */}
//       {project.githubLink && (
//         <a
//           href={project.githubLink}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline block mb-1"
//         >
//           🔗 GitHub
//         </a>
//       )}

//       {project.liveDemo && (
//         <a
//           href={project.liveDemo}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="text-blue-600 hover:underline block mb-5"
//         >
//           🚀 Live Demo
//         </a>
//       )}

//       {/* 💬 Comments */}
//       <div className="mt-8">
//         <Comments projectId={project._id} />
//       </div>
//     </div>
//   );
// }

// export default ProjectDetails;
import { useEffect, useState } from "react";

import axios from "axios";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import { auth } from "../firebaseConfig";

import {
  onAuthStateChanged,
} from "firebase/auth";

import LikeButton from "../components/likeButton";
import FavoriteButton from "../components/FavoriteButton";
import RatingStars from "../components/RatingStars";
import Comments from "../components/Comments";

function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(undefined);

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Track Auth State
  useEffect(() => {
    const unsub =
      onAuthStateChanged(
        auth,
        (currentUser) => {
          setUser(
            currentUser || null
          );
        }
      );

    return () => unsub();
  }, []);

  // Fetch Project
  useEffect(() => {
    if (user === undefined)
      return;

    const fetchProject =
      async () => {
        try {
          let headers = {};

          if (user) {
            const token =
              await user.getIdToken(
                true
              );

            headers.Authorization = `Bearer ${token}`;
          }

          const res =
            await axios.get(
              `${API_BASE}/api/projects/${id}`,
              { headers }
            );

          setProject(
            res.data
          );
        } catch (err) {
          console.error(
            "🔥 Error fetching project details:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchProject();
  }, [id, user]);

  // Loading State
  if (
    loading ||
    user === undefined
  ) {
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

  // Not Found
  if (!project) {
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
        Project not found.
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

      <div
        className="
          max-w-5xl
          mx-auto
        "
      >

        {/* Project Card */}
        <div
          className="
            relative
            overflow-hidden
            bg-[#111111]
            border border-white/10
            rounded-3xl
            p-8
          "
        >

          {/* Glow */}
          <div
            className="
              absolute
              w-[400px]
              h-[400px]
              bg-[#6D001A]/20
              blur-[140px]
              rounded-full
              top-[-120px]
              right-[-120px]
            "
          />

          <div className="relative z-10">

            {/* Author */}
            <div
              className="
                flex items-center
                gap-4
                mb-8
                cursor-pointer
              "
              onClick={() => {
                if (
                  project.userId ===
                  user?.uid
                ) {
                  navigate(
                    "/profile"
                  );
                } else if (
                  project.userId
                ) {
                  navigate(
                    `/profile/${project.userId}`
                  );
                }
              }}
            >

              {/* Avatar */}
              {project.authorPhoto ? (
                <img
                  src={
                    project.authorPhoto
                  }
                  alt={
                    project.authorName
                  }
                  className="
                    w-14 h-14
                    rounded-full
                    object-cover
                    border border-white/10
                  "
                />
              ) : (
                <div
                  className="
                    w-14 h-14
                    rounded-full
                    bg-[#1a1a1a]
                    border border-white/10
                    flex items-center justify-center
                    text-[#ff4d6d]
                    font-bold
                    text-xl
                  "
                >
                  {project.authorName?.charAt(
                    0
                  ) || "A"}
                </div>
              )}

              {/* Text */}
              <div>

                <h3
                  className="
                    text-lg
                    font-semibold
                    hover:text-[#ff4d6d]
                    transition-all
                  "
                >
                  {project.authorName ||
                    "Anonymous User"}
                </h3>

                <p
                  className="
                    text-sm
                    text-gray-500
                  "
                >
                  {new Date(
                    project.createdAt
                  ).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Thumbnail */}
            <div
              className="
                h-[300px]
                rounded-3xl
                bg-gradient-to-br
                from-[#1a1a1a]
                to-[#0f0f0f]
                border border-white/5
                mb-8
                flex items-center justify-center
              "
            >
              <span className="text-gray-600">
                Project Preview
              </span>
            </div>

            {/* Title */}
            <h1
              className="
                text-5xl
                font-black
                tracking-tight
                mb-5
              "
            >
              {project.title}
            </h1>

            {/* Description */}
            <p
              className="
                text-gray-300
                text-lg
                leading-relaxed
                mb-8
              "
            >
              {project.description}
            </p>

            {/* Tags */}
            {project.tags
              ?.length > 0 && (
              <div
                className="
                  flex flex-wrap
                  gap-3
                  mb-8
                "
              >
                {project.tags.map(
                  (
                    tag,
                    idx
                  ) => (
                    <span
                      key={idx}
                      className="
                        bg-[#6D001A]/15
                        border border-[#6D001A]/20
                        text-[#ff4d6d]
                        px-4 py-2
                        rounded-full
                        text-sm
                      "
                    >
                      #{tag}
                    </span>
                  )
                )}
              </div>
            )}

            {/* Actions */}
            <div
              className="
                flex flex-wrap
                items-center
                gap-4
                mb-10
              "
            >

              <LikeButton
                projectId={
                  project._id
                }
                initialLikes={
                  project.likes || 0
                }
                initiallyLiked={
                  project.likedByCurrentUser ||
                  false
                }
              />

              <FavoriteButton
                projectId={
                  project._id
                }
                initiallyFavorited={
                  project.favoritedByCurrentUser ||
                  false
                }
              />

              <RatingStars
                projectId={
                  project._id
                }
                initialRating={
                  project.averageRating ||
                  0
                }
                userInitialRating={
                  project.userRating ||
                  0
                }
              />
            </div>

            {/* Links */}
            <div
              className="
                flex flex-wrap
                gap-4
                mb-10
              "
            >

              {project.githubLink && (
                <a
                  href={
                    project.githubLink
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    bg-[#1a1a1a]
                    border border-white/10
                    hover:border-[#6D001A]
                    hover:bg-[#151515]
                    px-5 py-3
                    rounded-2xl
                    text-gray-300
                    hover:text-white
                    transition-all duration-300
                  "
                >
                  🔗 GitHub Repository
                </a>
              )}

              {project.liveDemo && (
                <a
                  href={
                    project.liveDemo
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    bg-[#6D001A]
                    hover:bg-[#8B0023]
                    px-5 py-3
                    rounded-2xl
                    text-white
                    transition-all duration-300
                    hover:shadow-[0_0_25px_rgba(109,0,26,0.45)]
                  "
                >
                  🚀 Live Demo
                </a>
              )}
            </div>

            {/* Comments */}
            <div
              className="
                border-t border-white/10
                pt-8
              "
            >
              <Comments
                projectId={
                  project._id
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;