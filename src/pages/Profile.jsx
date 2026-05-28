// import { useState, useEffect } from "react";
// import { auth } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import { useParams, useNavigate } from "react-router-dom";
// import axios from "axios";

// function Profile() {
//   const [user, setUser] = useState(null);
//   const [profile, setProfile] = useState(null);

//   // ⭐ NEW: store stats separately
//   const [stats, setStats] = useState({
//     totalProjects: 0,
//     totalLikes: 0,
//     totalComments: 0,
//   });

//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isOwnProfile, setIsOwnProfile] = useState(false);

//   const { userId } = useParams();
//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       setUser(currentUser || null);

//       if (currentUser) {
//         if (!userId || userId === currentUser.uid) {
//           setIsOwnProfile(true);
//           await fetchOwnProfile(currentUser);
//         } else {
//           setIsOwnProfile(false);
//           await fetchPublicProfile(userId);
//         }
//       } else {
//         if (userId) {
//           await fetchPublicProfile(userId);
//         }
//       }

//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [userId]);

//   // ⭐ FIXED: store stats separately
//   const fetchOwnProfile = async (currentUser) => {
//     try {
//       const token = await currentUser.getIdToken(true);

//       const res = await axios.get(`${API_BASE}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setProfile(res.data.profile);
//       setProjects(res.data.projects || []);

//       setStats({
//         totalProjects: res.data.totalProjects,
//         totalLikes: res.data.totalLikes,
//         totalComments: res.data.totalComments,
//       });
//     } catch (err) {
//       console.error("🔥 Error fetching own profile:", err);
//     }
//   };

//   // ⭐ FIXED: store stats separately
//   const fetchPublicProfile = async (uid) => {
//     try {
//       const res = await axios.get(`${API_BASE}/api/users/${uid}`);

//       setProfile(res.data.profile);
//       setProjects(res.data.projects || []);

//       setStats({
//         totalProjects: res.data.totalProjects,
//         totalLikes: res.data.totalLikes,
//         totalComments: res.data.totalComments,
//       });
//     } catch (err) {
//       console.error("🔥 Error fetching public profile:", err);
//     }
//   };

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-gray-600">
//         Loading profile...
//       </div>
//     );

//   if (!profile)
//     return (
//       <div className="text-center mt-10 text-gray-500">
//         User profile not found.
//       </div>
//     );

//   return (
//     <div className="max-w-5xl mx-auto p-6">
//       <div className="bg-white p-6 rounded-lg shadow-md mb-6">
//         <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
//         <p className="text-gray-600 mb-1">{profile.email}</p>
//         <p className="text-gray-700 italic mb-4">
//           {profile.bio || "No bio provided yet."}
//         </p>

//         {/* ⭐ FIXED: using values from stats */}
//         <div className="flex gap-6 mb-3">
//           <div>
//             <h3 className="text-2xl font-bold text-blue-600">
//               {stats.totalProjects}
//             </h3>
//             <p className="text-gray-500 text-sm">Projects</p>
//           </div>

//           <div>
//             <h3 className="text-2xl font-bold text-red-500">
//               {stats.totalLikes}
//             </h3>
//             <p className="text-gray-500 text-sm">Likes</p>
//           </div>

//           <div>
//             <h3 className="text-2xl font-bold text-green-600">
//               {stats.totalComments}
//             </h3>
//             <p className="text-gray-500 text-sm">Comments</p>
//           </div>
//         </div>

//         {isOwnProfile && (
//           <button
//             onClick={() => navigate("/edit-profile")}
//             className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//           >
//             ✏️ Edit Profile
//           </button>
//         )}
//       </div>

//       <h2 className="text-2xl font-semibold mb-3">
//         {isOwnProfile ? "My Projects" : `${profile.name}'s Projects`}
//       </h2>

//       {projects.length === 0 ? (
//         <p className="text-gray-500">No projects yet.</p>
//       ) : (
//         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {projects.map((p) => (
//             <div
//               key={p._id}
//               onClick={() => navigate(`/project/${p._id}`)}
//               className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer hover:bg-gray-50"
//             >
//               <h3 className="font-semibold text-lg mb-1">{p.title}</h3>
//               <p className="text-sm text-gray-600 mb-2">
//                 {p.description?.slice(0, 80)}...
//               </p>
//               <p className="text-xs text-gray-500">
//                 ❤️ {p.likes || 0} · 💬 {p.comments?.length || 0}
//               </p>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Profile;

import { useState, useEffect } from "react";

import { auth } from "../firebaseConfig";

import {
  onAuthStateChanged,
} from "firebase/auth";

import {
  useParams,
  useNavigate,
} from "react-router-dom";

import axios from "axios";

function Profile() {
  const [user, setUser] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [stats, setStats] =
    useState({
      totalProjects: 0,
      totalLikes: 0,
      totalComments: 0,
    });

  const [projects, setProjects] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [isOwnProfile, setIsOwnProfile] =
    useState(false);

  const { userId } = useParams();

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Auth State
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (currentUser) => {
          setUser(currentUser || null);

          if (currentUser) {
            if (
              !userId ||
              userId === currentUser.uid
            ) {
              setIsOwnProfile(true);

              await fetchOwnProfile(
                currentUser
              );
            } else {
              setIsOwnProfile(false);

              await fetchPublicProfile(
                userId
              );
            }
          } else {
            if (userId) {
              await fetchPublicProfile(
                userId
              );
            }
          }

          setLoading(false);
        }
      );

    return () => unsubscribe();
  }, [userId]);

  // Fetch Own Profile
  const fetchOwnProfile = async (
    currentUser
  ) => {
    try {
      const token =
        await currentUser.getIdToken(
          true
        );

      const res = await axios.get(
        `${API_BASE}/api/users/me`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProfile(
        res.data.profile
      );

      setProjects(
        res.data.projects || []
      );

      setStats({
        totalProjects:
          res.data.totalProjects,

        totalLikes:
          res.data.totalLikes,

        totalComments:
          res.data.totalComments,
      });
    } catch (err) {
      console.error(
        "🔥 Error fetching own profile:",
        err
      );
    }
  };

  // Fetch Public Profile
  const fetchPublicProfile =
    async (uid) => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/users/${uid}`
        );

        setProfile(
          res.data.profile
        );

        setProjects(
          res.data.projects || []
        );

        setStats({
          totalProjects:
            res.data.totalProjects,

          totalLikes:
            res.data.totalLikes,

          totalComments:
            res.data.totalComments,
        });
      } catch (err) {
        console.error(
          "🔥 Error fetching public profile:",
          err
        );
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
        Loading profile...
      </div>
    );
  }

  // No Profile
  if (!profile) {
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
        User profile not found.
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

      {/* Profile Header */}
      <div
        className="
          relative
          overflow-hidden
          bg-[#111111]
          border border-white/10
          rounded-3xl
          p-8
          mb-10
        "
      >

        {/* Glow */}
        <div
          className="
            absolute
            w-[350px]
            h-[350px]
            bg-[#6D001A]/20
            blur-[120px]
            rounded-full
            top-[-100px]
            right-[-80px]
          "
        />

        <div className="relative z-10">

          {/* User Info */}
          <div
            className="
              flex flex-col md:flex-row
              md:items-center
              md:justify-between
              gap-6
            "
          >

            <div className="flex items-center gap-5">

              {/* Avatar */}
              <div
                className="
                  w-24 h-24
                  rounded-full
                  bg-[#1a1a1a]
                  border border-white/10
                  flex items-center justify-center
                  text-3xl
                  font-bold
                  text-[#ff4d6d]
                "
              >
                {profile.name?.charAt(0)}
              </div>

              {/* Text */}
              <div>

                <h1
                  className="
                    text-4xl
                    font-black
                    tracking-tight
                    mb-1
                  "
                >
                  {profile.name}
                </h1>

                <p className="text-gray-500 mb-3">
                  {profile.email}
                </p>

                <p
                  className="
                    text-gray-300
                    max-w-2xl
                    leading-relaxed
                  "
                >
                  {profile.bio ||
                    "No bio provided yet."}
                </p>
              </div>
            </div>

            {/* Edit Button */}
            {isOwnProfile && (
              <button
                onClick={() =>
                  navigate(
                    "/edit-profile"
                  )
                }
                className="
                  bg-[#6D001A]
                  hover:bg-[#8B0023]
                  px-5 py-3
                  rounded-2xl
                  text-white
                  font-medium
                  transition-all duration-300
                  hover:shadow-[0_0_25px_rgba(109,0,26,0.45)]
                "
              >
                Edit Profile
              </button>
            )}
          </div>

          {/* Stats */}
          <div
            className="
              grid
              grid-cols-1
              sm:grid-cols-3
              gap-5
              mt-10
            "
          >

            {/* Projects */}
            <div
              className="
                bg-[#1a1a1a]
                border border-white/10
                rounded-2xl
                p-5
              "
            >
              <h3
                className="
                  text-4xl
                  font-black
                  text-[#ff4d6d]
                  mb-2
                "
              >
                {stats.totalProjects}
              </h3>

              <p className="text-gray-400">
                Projects
              </p>
            </div>

            {/* Likes */}
            <div
              className="
                bg-[#1a1a1a]
                border border-white/10
                rounded-2xl
                p-5
              "
            >
              <h3
                className="
                  text-4xl
                  font-black
                  text-[#ff4d6d]
                  mb-2
                "
              >
                {stats.totalLikes}
              </h3>

              <p className="text-gray-400">
                Likes
              </p>
            </div>

            {/* Comments */}
            <div
              className="
                bg-[#1a1a1a]
                border border-white/10
                rounded-2xl
                p-5
              "
            >
              <h3
                className="
                  text-4xl
                  font-black
                  text-[#ff4d6d]
                  mb-2
                "
              >
                {stats.totalComments}
              </h3>

              <p className="text-gray-400">
                Comments
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="mb-6">

        <h2
          className="
            text-3xl
            font-bold
            tracking-tight
            mb-2
          "
        >
          {isOwnProfile
            ? "My Projects"
            : `${profile.name}'s Projects`}
        </h2>

        <p className="text-gray-500">
          Explore published work and
          developer creations.
        </p>
      </div>

      {/* Empty State */}
      {projects.length === 0 ? (
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
            No projects yet.
          </p>
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
                  h-[180px]
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
              <h3
                className="
                  text-2xl
                  font-bold
                  mb-3
                  group-hover:text-[#ff4d6d]
                  transition-all
                "
              >
                {p.title}
              </h3>

              {/* Description */}
              <p
                className="
                  text-sm
                  text-gray-400
                  leading-relaxed
                  line-clamp-3
                  mb-5
                "
              >
                {p.description}
              </p>

              {/* Stats */}
              <div
                className="
                  flex items-center
                  gap-4
                  text-sm
                  text-gray-500
                "
              >
                <span>
                  ❤️ {p.likes || 0}
                </span>

                <span>
                  💬{" "}
                  {p.comments
                    ?.length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;