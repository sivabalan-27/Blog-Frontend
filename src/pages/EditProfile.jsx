// import { useEffect, useState } from "react";
// import { auth } from "../firebaseConfig";
// import { onAuthStateChanged } from "firebase/auth";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// function EditProfile() {
//   const [user, setUser] = useState(null);
//   const [name, setName] = useState("");
//   const [bio, setBio] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [errorMsg, setErrorMsg] = useState("");

//   const navigate = useNavigate();
//   const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (!currentUser) {
//         navigate("/login");
//         return;
//       }

//       setUser(currentUser);
//       await fetchProfile(currentUser);
//     });

//     return () => unsubscribe();
//   }, []);

//   // 🔹 Load existing profile data
//   const fetchProfile = async (currentUser) => {
//     try {
//       const token = await currentUser.getIdToken(true);

//       const res = await axios.get(`${API_BASE}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setName(res.data.profile.name || "");
//       setBio(res.data.profile.bio || "");
//     } catch (err) {
//       console.error("🔥 Error loading profile:", err);
//       setErrorMsg("Failed to load profile.");
//     }
//   };

//   // 🔹 Save updated profile
//   const handleSave = async (e) => {
//     e.preventDefault();
//     if (!user) return;

//     if (name.trim() === "" || bio.trim() === "") {
//       setErrorMsg("⚠️ Name and bio cannot be empty.");
//       return;
//     }

//     setSaving(true);
//     setErrorMsg("");

//     try {
//       const token = await user.getIdToken(true);

//       await axios.put(
//         `${API_BASE}/api/users/me`,
//         { name, bio },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       alert("✅ Profile updated successfully!");
//       navigate("/profile");
//     } catch (err) {
//       console.error("🔥 Error saving profile:", err);

//       if (err.response?.data?.message) {
//         setErrorMsg(err.response.data.message);
//       } else {
//         setErrorMsg("Failed to update profile.");
//       }
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-10">
//       <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

//       {errorMsg && (
//         <p className="text-red-500 mb-3 text-center font-medium">{errorMsg}</p>
//       )}

//       <form onSubmit={handleSave} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Full Name"
//           className="border p-2 rounded"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           required
//         />

//         <textarea
//           placeholder="Your bio..."
//           className="border p-2 rounded resize-none"
//           rows="3"
//           value={bio}
//           onChange={(e) => setBio(e.target.value)}
//           required
//         />

//         <button
//           disabled={saving}
//           className={`${
//             saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//           } text-white p-2 rounded transition`}
//         >
//           {saving ? "Saving..." : "Save Changes"}
//         </button>
//       </form>
//     </div>
//   );
// }

// export default EditProfile;

import { useEffect, useState } from "react";

import { auth } from "../firebaseConfig";

import {
  onAuthStateChanged,
} from "firebase/auth";

import axios from "axios";

import {
  useNavigate,
} from "react-router-dom";

function EditProfile() {
  const [user, setUser] =
    useState(null);

  const [name, setName] =
    useState("");

  const [bio, setBio] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [errorMsg, setErrorMsg] =
    useState("");

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL ||
    "http://localhost:3000";

  // Watch Auth State
  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (
          currentUser
        ) => {
          if (!currentUser) {
            navigate(
              "/login"
            );

            return;
          }

          setUser(
            currentUser
          );

          await fetchProfile(
            currentUser
          );
        }
      );

    return () =>
      unsubscribe();
  }, []);

  // Fetch Profile
  const fetchProfile =
    async (
      currentUser
    ) => {
      try {
        const token =
          await currentUser.getIdToken(
            true
          );

        const res =
          await axios.get(
            `${API_BASE}/api/users/me`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

        setName(
          res.data.profile
            .name || ""
        );

        setBio(
          res.data.profile
            .bio || ""
        );
      } catch (err) {
        console.error(
          "🔥 Error loading profile:",
          err
        );

        setErrorMsg(
          "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

  // Save Profile
  const handleSave =
    async (e) => {
      e.preventDefault();

      if (!user) return;

      if (
        name.trim() ===
          "" ||
        bio.trim() === ""
      ) {
        setErrorMsg(
          "⚠️ Name and bio cannot be empty."
        );

        return;
      }

      setSaving(true);
      setErrorMsg("");

      try {
        const token =
          await user.getIdToken(
            true
          );

        await axios.put(
          `${API_BASE}/api/users/me`,
          {
            name,
            bio,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        alert(
          "✅ Profile updated successfully!"
        );

        navigate(
          "/profile"
        );
      } catch (err) {
        console.error(
          "🔥 Error saving profile:",
          err
        );

        if (
          err.response?.data
            ?.message
        ) {
          setErrorMsg(
            err.response
              .data.message
          );
        } else {
          setErrorMsg(
            "Failed to update profile."
          );
        }
      } finally {
        setSaving(false);
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
              tracking-tight
              mb-2
            "
          >
            Edit{" "}
            <span className="text-[#8B0023]">
              Profile
            </span>
          </h2>

          <p className="text-gray-500">
            Update your public profile
            information.
          </p>
        </div>

        {/* Error */}
        {errorMsg && (
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
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSave}
          className="
            flex flex-col
            gap-5
          "
        >

          {/* Name */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Full Name
            </label>

            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
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

          {/* Bio */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Bio
            </label>

            <textarea
              placeholder="Tell people about yourself..."
              rows="5"
              value={bio}
              onChange={(e) =>
                setBio(
                  e.target.value
                )
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
                resize-none
              "
            />
          </div>

          {/* Save Button */}
          <button
            disabled={saving}
            className={`
              mt-4
              py-4
              rounded-2xl
              text-white
              font-semibold
              transition-all duration-300
              ${
                saving
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
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;