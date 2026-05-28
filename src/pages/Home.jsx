// import { useEffect, useState } from "react";
// import axios from "axios";
// import LikeButton from "../components/likeButton";
// import FavoriteButton from "../components/FavoriteButton";
// import RatingStars from "../components/RatingStars";
// import { auth } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { useNavigate } from "react-router-dom";

// function Home() {
//   const [projects, setProjects] = useState([]);
//   const [filteredProjects, setFilteredProjects] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(undefined);
//   const [page, setPage] = useState(1);
//   const [totalPages, setTotalPages] = useState(1);
//   const [profileComplete, setProfileComplete] = useState(true);

//   // ⭐️ NEW: Filter Type
//   const [filterType, setFilterType] = useState("recent");

//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   // --------------------------
//   // 🧭 WATCH FIREBASE USER
//   // --------------------------
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser || null);
//       if (currentUser) await checkProfileStatus(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   // --------------------------
//   // 🔎 CHECK IF PROFILE COMPLETE
//   // --------------------------
//   const checkProfileStatus = async (currentUser) => {
//     try {
//       const token = await currentUser.getIdToken(true);
//       const res = await axios.get(`${API_BASE}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const p = res.data.profile;
//       const isComplete = p.name?.trim() !== "" && p.bio?.trim() !== "";
//       setProfileComplete(isComplete);
//     } catch (err) {
//       console.error("⚠️ Failed to check profile:", err);
//     }
//   };

//   // --------------------------
//   // 📦 FETCH PROJECTS (PAGINATION)
//   // --------------------------
//   useEffect(() => {
//     if (user === undefined) return;

//     const fetchProjects = async () => {
//       try {
//         let headers = {};
//         if (user) {
//           const token = await user.getIdToken(true);
//           headers.Authorization = `Bearer ${token}`;
//         }

//         const res = await axios.get(
//           `${API_BASE}/api/projects?page=${page}&limit=9`,
//           { headers }
//         );

//         setProjects(res.data.projects);
//         setFilteredProjects(res.data.projects);
//         setTotalPages(res.data.totalPages);
//       } catch (err) {
//         console.error("❌ Error fetching projects:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProjects();
//   }, [user, page]);

//   // --------------------------
//   // 🔍 SEARCH FILTER
//   // --------------------------
//   useEffect(() => {
//     const filtered = projects.filter((p) =>
//       [p.title, p.description, p.tags?.join(", ")]
//         .join(" ")
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase())
//     );
//     setFilteredProjects(filtered);
//   }, [searchTerm, projects]);

//   // --------------------------
//   // ⭐️ SORT FILTER (MOST RECENT / OLD / LIKED / COMMENTED)
//   // --------------------------
//   useEffect(() => {
//     let sorted = [...filteredProjects];

//     switch (filterType) {
//       case "liked":
//         sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
//         break;

//       case "commented":
//         sorted.sort((a, b) => (b.commentCount || 0) - (a.commentCount || 0));
//         break;

//       case "old":
//         sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         break;

//       default: // recent
//         sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
//         break;
//     }

//     setFilteredProjects(sorted);
//   }, [filterType]);

//   // --------------------------
//   // LOADING STATE
//   // --------------------------
//   if (loading || user === undefined) {
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600 dark:text-gray-300">
//         Loading projects...
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white text-black dark:bg-gray-900 dark:text-white transition-colors">

//       {/* -------------------------- */}
//       {/* ⚠️ PROFILE INCOMPLETE WARNING */}
//       {/* -------------------------- */}
//       {user && !profileComplete && (
//         <div className="bg-yellow-100 dark:bg-yellow-700 border border-yellow-400 dark:border-yellow-500 text-yellow-800 dark:text-yellow-100 p-4 rounded mb-4">
//           <p className="font-semibold">⚠️ Complete your profile</p>
//           <p className="text-sm">
//             You must add your <b>name</b> and <b>bio</b> before adding a project.
//           </p>
//           <button
//             onClick={() => navigate("/edit-profile")}
//             className="mt-2 bg-yellow-500 dark:bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-600 dark:hover:bg-yellow-700"
//           >
//             Complete Profile
//           </button>
//         </div>
//       )}

//       {/* -------------------------- */}
//       {/* 🔍 SEARCH + FILTER BAR */}
//       {/* -------------------------- */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
//         <h1 className="text-2xl font-bold mb-3 md:mb-0">All Projects</h1>

//         <input
//           type="text"
//           placeholder="Search by title, description, or tag..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="border border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-white rounded-md px-3 py-2 w-full md:w-1/3"
//         />
//       </div>

//       {/* ⭐️ SORT DROPDOWN */}
//       <div className="mb-4 flex justify-end">
//         <select
//           value={filterType}
//           onChange={(e) => setFilterType(e.target.value)}
//           className="border px-3 py-2 rounded-md bg-white dark:bg-gray-800 dark:text-white shadow"
//         >
//           <option value="recent">Most Recent</option>
//           <option value="old">Most Old</option>
//           <option value="liked">Most Liked</option>
//           <option value="commented">Most Commented</option>
//         </select>
//       </div>

//       {/* -------------------------- */}
//       {/* 🚫 NO PROJECTS MESSAGE */}
//       {/* -------------------------- */}
//       {filteredProjects.length === 0 ? (
//         <p className="text-gray-500 dark:text-gray-400">No projects found.</p>
//       ) : (
//         <>
//           {/* -------------------------- */}
//           {/* PROJECT GRID */}
//           {/* -------------------------- */}
//           <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//             {filteredProjects.map((p) => (
//               <div
//                 key={p._id}
//                 className="p-4 border border-gray-300 dark:border-gray-700 rounded-lg shadow-sm bg-white dark:bg-gray-800 hover:shadow-md transition cursor-pointer"
//                 onClick={() => navigate(`/project/${p._id}`)}
//               >
//                 {/* AUTHOR */}
//                 <div
//                   className="flex items-center gap-2 mb-3"
//                   onClick={(e) => {
//                     e.stopPropagation();
//                     navigate(
//                       p.userId === user?.uid
//                         ? "/profile"
//                         : `/profile/${p.userId}`
//                     );
//                   }}
//                 >
//                   <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
//                   <span className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
//                     {p.authorName || "Anonymous User"}
//                   </span>
//                 </div>

//                 {/* TITLE & DESCRIPTION */}
//                 <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
//                 <p className="text-gray-700 dark:text-gray-300 mb-2 line-clamp-3">
//                   {p.description}
//                 </p>

//                 {/* TAGS */}
//                 {p.tags?.length > 0 && (
//                   <div className="flex flex-wrap gap-1 mb-2">
//                     {p.tags.map((tag, idx) => (
//                       <span
//                         key={idx}
//                         className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full"
//                       >
//                         #{tag}
//                       </span>
//                     ))}
//                   </div>
//                 )}

//                 {/* LIKE / FAV / COMMENTS */}
//                 <div className="flex items-center justify-between mt-2">
//                   <LikeButton
//                     projectId={p._id}
//                     initialLikes={p.likes || 0}
//                     initiallyLiked={p.likedByCurrentUser || false}
//                   />

//                   <FavoriteButton
//                     projectId={p._id}
//                     initiallyFavorited={p.favoritedByCurrentUser || false}
//                   />

//                   <p className="text-sm">💬 {p.commentCount || 0}</p>
//                 </div>

//                 {/* RATING */}
//                 <RatingStars
//                   projectId={p._id}
//                   initialRating={p.averageRating || 0}
//                   userInitialRating={p.userRating || 0}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* -------------------------- */}
//           {/* PAGINATION */}
//           {/* -------------------------- */}
//           {totalPages > 1 && (
//             <div className="flex justify-center items-center gap-4 mt-6">
//               <button
//                 disabled={page <= 1}
//                 onClick={() => setPage((prev) => prev - 1)}
//                 className={`px-4 py-2 rounded-md font-semibold ${
//                   page <= 1
//                     ? "bg-gray-300 dark:bg-gray-700 text-gray-500"
//                     : "bg-blue-500 hover:bg-blue-600 text-white"
//                 }`}
//               >
//                 Previous
//               </button>

//               <span className="font-medium">
//                 Page {page} of {totalPages}
//               </span>

//               <button
//                 disabled={page >= totalPages}
//                 onClick={() => setPage((prev) => prev + 1)}
//                 className={`px-4 py-2 rounded-md font-semibold ${
//                   page >= totalPages
//                     ? "bg-gray-300 dark:bg-gray-700 text-gray-500"
//                     : "bg-blue-500 hover:bg-blue-600 text-white"
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// export default Home;


import { useEffect, useState } from "react";
import axios from "axios";

import LikeButton from "../components/likeButton";
import FavoriteButton from "../components/FavoriteButton";
import RatingStars from "../components/RatingStars";

import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";

import { useNavigate } from "react-router-dom";

function Home() {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] =
    useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(undefined);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] =
    useState(1);

  const [profileComplete, setProfileComplete] =
    useState(true);

  // Filter Type
  const [filterType, setFilterType] =
    useState("recent");

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Watch Firebase User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser || null);

        if (currentUser) {
          await checkProfileStatus(
            currentUser
          );
        }
      }
    );

    return () => unsubscribe();
  }, []);

  // Check Profile Status
  const checkProfileStatus = async (
    currentUser
  ) => {
    try {
      const token =
        await currentUser.getIdToken(true);

      const res = await axios.get(
        `${API_BASE}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const p = res.data.profile;

      const isComplete =
        p.name?.trim() !== "" &&
        p.bio?.trim() !== "";

      setProfileComplete(isComplete);
    } catch (err) {
      console.error(
        "⚠️ Failed to check profile:",
        err
      );
    }
  };

  // Fetch Projects
  useEffect(() => {
    if (user === undefined) return;

    const fetchProjects = async () => {
      try {
        let headers = {};

        if (user) {
          const token =
            await user.getIdToken(true);

          headers.Authorization = `Bearer ${token}`;
        }

        const res = await axios.get(
          `${API_BASE}/api/projects?page=${page}&limit=9`,
          { headers }
        );

        setProjects(res.data.projects);
        setFilteredProjects(
          res.data.projects
        );

        setTotalPages(
          res.data.totalPages
        );
      } catch (err) {
        console.error(
          "❌ Error fetching projects:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [user, page]);

  // Search Filter
  useEffect(() => {
    const filtered = projects.filter((p) =>
      [
        p.title,
        p.description,
        p.tags?.join(", "),
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    setFilteredProjects(filtered);
  }, [searchTerm, projects]);

  // Sort Filter
  useEffect(() => {
    let sorted = [...filteredProjects];

    switch (filterType) {
      case "liked":
        sorted.sort(
          (a, b) =>
            (b.likes || 0) -
            (a.likes || 0)
        );
        break;

      case "commented":
        sorted.sort(
          (a, b) =>
            (b.commentCount || 0) -
            (a.commentCount || 0)
        );
        break;

      case "old":
        sorted.sort(
          (a, b) =>
            new Date(a.createdAt) -
            new Date(b.createdAt)
        );
        break;

      default:
        sorted.sort(
          (a, b) =>
            new Date(b.createdAt) -
            new Date(a.createdAt)
        );
        break;
    }

    setFilteredProjects(sorted);
  }, [filterType]);

  // Loading
  if (loading || user === undefined) {
    return (
      <div
        className="
          min-h-screen
          flex items-center justify-center
          bg-[#050505]
          text-gray-400
          text-lg
        "
      >
        Loading projects...
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-[#050505]
        text-white
        px-6 py-8
      "
    >

      {/* Hero Section */}
      <div
        className="
          relative
          overflow-hidden
          rounded-3xl
          border border-white/10
          bg-[#111111]
          p-10
          mb-8
        "
      >

        {/* Glow */}
        <div
          className="
            absolute
            w-[400px]
            h-[400px]
            bg-[#6D001A]/20
            blur-[120px]
            rounded-full
            top-[-120px]
            right-[-100px]
          "
        />

        <div className="relative z-10">

          <h1
            className="
            text-6xl leading-tight
              font-black
              tracking-tight
              mb-4
            "
          >
            Discover Amazing{" "}
            <span className="text-[#8B0023]">
              Developer Projects
            </span>
          </h1>

          <p
            className="
              text-gray-400
              text-lg
              max-w-2xl
            "
          >
            Explore innovative
            creations from developers
            around the world.
          </p>
        </div>
      </div>

      {/* Profile Warning */}
      {user && !profileComplete && (
        <div
          className="
            bg-[#6D001A]/15
            border border-[#6D001A]/30
            text-red-200
            p-5
            rounded-2xl
            mb-6
          "
        >
          <p className="font-semibold">
            ⚠️ Complete your profile
          </p>

          <p className="text-sm mt-1 text-gray-300">
            Add your name and bio
            before adding projects.
          </p>

          <button
            onClick={() =>
              navigate("/edit-profile")
            }
            className="
              mt-4
              bg-[#6D001A]
              hover:bg-[#8B0023]
              px-4 py-2
              rounded-xl
              transition-all duration-300
            "
          >
            Complete Profile
          </button>
        </div>
      )}

      {/* Search + Filter */}
      <div
        className="
          flex flex-col lg:flex-row
          gap-4
          justify-between
          items-start lg:items-center
          mb-8
        "
      >

        {/* Search */}
        <div className="w-full lg:w-[420px]">

          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) =>
              setSearchTerm(
                e.target.value
              )
            }
            className="
              w-full
              bg-[#111111]
              border border-white/10
              rounded-2xl
              px-5 py-3
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

        {/* Filter */}
        <select
          value={filterType}
          onChange={(e) =>
            setFilterType(
              e.target.value
            )
          }
          className="
            bg-[#111111]
            border border-white/10
            rounded-2xl
            px-5 py-3
            text-gray-300
            focus:outline-none
            focus:border-[#6D001A]
          "
        >
          <option value="recent">
            Most Recent
          </option>

          <option value="old">
            Oldest
          </option>

          <option value="liked">
            Most Liked
          </option>

          <option value="commented">
            Most Commented
          </option>
        </select>
      </div>

      {/* No Projects */}
      {filteredProjects.length === 0 ? (
        <div
          className="
            bg-[#111111]
            border border-white/10
            rounded-3xl
            p-10
            text-center
          "
        >
          <p className="text-gray-500">
            No projects found.
          </p>
        </div>
      ) : (
        <>
          {/* Project Grid */}
          <div
            className="
              grid
              gap-6
              md:grid-cols-2
              xl:grid-cols-3
            "
          >

            {filteredProjects.map((p) => (
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
                    overflow-hidden
                    flex items-center justify-center
                  "
                >
                  <span className="text-gray-600 text-sm">
                    Project Preview
                  </span>
                </div>

                {/* Author */}
                <div
                  className="
                    flex items-center
                    gap-3
                    mb-4
                  "
                  onClick={(e) => {
                    e.stopPropagation();

                    navigate(
                      p.userId ===
                        user?.uid
                        ? "/profile"
                        : `/profile/${p.userId}`
                    );
                  }}
                >

                  <div
                    className="
                      w-10 h-10
                      rounded-full
                      bg-[#1f1f1f]
                      border border-white/10
                    "
                  />

                  <span
                    className="
                      text-sm
                      text-gray-300
                      hover:text-white
                      transition
                    "
                  >
                    {p.authorName ||
                      "Anonymous User"}
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
                    mb-4
                  "
                >
                  {p.description}
                </p>

                {/* Tags */}
                {p.tags?.length > 0 && (
                  <div
                    className="
                      flex flex-wrap
                      gap-2
                      mb-5
                    "
                  >
                    {p.tags.map(
                      (tag, idx) => (
                        <span
                          key={idx}
                          className="
                            text-xs
                            bg-[#6D001A]/15
                            border border-[#6D001A]/20
                            text-[#ff4d6d]
                            px-3 py-1
                            rounded-full
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
                    flex items-center
                    justify-between
                    gap-2
                    mb-4
                  "
                >
                  <LikeButton
                    projectId={p._id}
                    initialLikes={
                      p.likes || 0
                    }
                    initiallyLiked={
                      p.likedByCurrentUser ||
                      false
                    }
                  />

                  <FavoriteButton
                    projectId={p._id}
                    initiallyFavorited={
                      p.favoritedByCurrentUser ||
                      false
                    }
                  />
                </div>

                {/* Bottom */}
                <div
                  className="
                    flex items-center
                    justify-between
                    mt-4
                  "
                >

                  <RatingStars
                    projectId={p._id}
                    initialRating={
                      p.averageRating || 0
                    }
                    userInitialRating={
                      p.userRating || 0
                    }
                  />

                  <p
                    className="
                      text-sm
                      text-gray-500
                    "
                  >
                    💬{" "}
                    {p.commentCount || 0}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div
              className="
                flex items-center
                justify-center
                gap-5
                mt-10
              "
            >

              <button
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) =>
                    prev - 1
                  )
                }
                className={`
                  px-5 py-3
                  rounded-2xl
                  transition-all duration-300
                  ${
                    page <= 1
                      ? `
                        bg-[#1a1a1a]
                        text-gray-600
                        cursor-not-allowed
                      `
                      : `
                        bg-[#6D001A]
                        hover:bg-[#8B0023]
                        hover:shadow-[0_0_25px_rgba(109,0,26,0.4)]
                      `
                  }
                `}
              >
                Previous
              </button>

              <span className="text-gray-400">
                Page {page} of{" "}
                {totalPages}
              </span>

              <button
                disabled={
                  page >= totalPages
                }
                onClick={() =>
                  setPage((prev) =>
                    prev + 1
                  )
                }
                className={`
                  px-5 py-3
                  rounded-2xl
                  transition-all duration-300
                  ${
                    page >= totalPages
                      ? `
                        bg-[#1a1a1a]
                        text-gray-600
                        cursor-not-allowed
                      `
                      : `
                        bg-[#6D001A]
                        hover:bg-[#8B0023]
                        hover:shadow-[0_0_25px_rgba(109,0,26,0.4)]
                      `
                  }
                `}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Home;