// import { useEffect, useState } from "react";
// import axios from "axios";
// import { auth } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import LikeButton from "../components/likeButton";
// import FavoriteButton from "../components/FavoriteButton";
// import { useNavigate } from "react-router-dom";

// function Favorites() {
//   const [favorites, setFavorites] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });
//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const fetchFavorites = async () => {
//       if (!user) return;
//       try {
//         const token = await user.getIdToken(true);
//         const res = await axios.get(`${API_BASE}/api/projects/favorites/my`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setFavorites(res.data);
//       } catch (err) {
//         console.error("🔥 Error fetching favorites:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchFavorites();
//   }, [user]);

//   if (loading)
//     return (
//       <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">
//         Loading favorites...
//       </div>
//     );

//   if (!user)
//     return (
//       <p className="text-center text-gray-600 mt-10">
//         Please log in to view your favorites.
//       </p>
//     );

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">⭐ My Favorite Projects</h1>

//       {favorites.length === 0 ? (
//         <p className="text-gray-500">You haven't added any favorites yet.</p>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//           {favorites.map((p) => (
//             <div
//               key={p._id}
//               className="p-4 border rounded-lg shadow-sm hover:shadow-md transition cursor-pointer"
//               onClick={() => navigate(`/project/${p._id}`)}
//             >
//               <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
//               <p className="text-gray-700 mb-2 line-clamp-3">
//                 {p.description}
//               </p>

//               <div
//                 className="flex items-center justify-between mt-2"
//                 onClick={(e) => e.stopPropagation()}
//               >
//                 <LikeButton
//                   projectId={p._id}
//                   initialLikes={p.likes || 0}
//                   initiallyLiked={p.likedByCurrentUser || false}
//                 />

//                 <FavoriteButton
//                   projectId={p._id}
//                   initiallyFavorited={true}
//                 />
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// export default Favorites;

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
import FavoriteButton from "../components/FavoriteButton";

function Favorites() {
  const [favorites, setFavorites] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState(null);

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

  // Fetch Favorites
  useEffect(() => {
    const fetchFavorites =
      async () => {
        if (!user) return;

        try {
          const token =
            await user.getIdToken(
              true
            );

          const res =
            await axios.get(
              `${API_BASE}/api/projects/favorites/my`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );

          setFavorites(
            res.data
          );
        } catch (err) {
          console.error(
            "🔥 Error fetching favorites:",
            err
          );
        } finally {
          setLoading(false);
        }
      };

    fetchFavorites();
  }, [user]);

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
        Loading favorites...
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
        favorite projects.
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
      <div className="mb-10">

        <h1
          className="
            text-5xl
            font-black
            tracking-tight
            mb-3
          "
        >
          Favorite{" "}
          <span className="text-[#8B0023]">
            Projects
          </span>
        </h1>

        <p className="text-gray-500">
          Your saved collection of
          inspiring developer projects.
        </p>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
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
            No Favorites Yet
          </h2>

          <p className="text-gray-500 mb-6">
            Start exploring and save
            projects you love.
          </p>

          <button
            onClick={() =>
              navigate("/")
            }
            className="
              bg-[#6D001A]
              hover:bg-[#8B0023]
              px-6 py-3
              rounded-2xl
              text-white
              transition-all duration-300
              hover:shadow-[0_0_25px_rgba(109,0,26,0.4)]
            "
          >
            Explore Projects
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

          {favorites.map((p) => (
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

              {/* Tags */}
              {p.tags
                ?.length > 0 && (
                <div
                  className="
                    flex flex-wrap
                    gap-2
                    mb-5
                  "
                >
                  {p.tags.map(
                    (
                      tag,
                      idx
                    ) => (
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
                  gap-3
                  mt-5
                "
                onClick={(e) =>
                  e.stopPropagation()
                }
              >

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

                <FavoriteButton
                  projectId={
                    p._id
                  }
                  initiallyFavorited={
                    true
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Favorites;