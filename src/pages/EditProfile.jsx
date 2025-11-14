import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EditProfile() {
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();
  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
      await fetchProfile(currentUser);
    });

    return () => unsubscribe();
  }, []);

  // 🔹 Load existing profile data
  const fetchProfile = async (currentUser) => {
    try {
      const token = await currentUser.getIdToken(true);

      const res = await axios.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setName(res.data.profile.name || "");
      setBio(res.data.profile.bio || "");
    } catch (err) {
      console.error("🔥 Error loading profile:", err);
      setErrorMsg("Failed to load profile.");
    }
  };

  // 🔹 Save updated profile
  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;

    if (name.trim() === "" || bio.trim() === "") {
      setErrorMsg("⚠️ Name and bio cannot be empty.");
      return;
    }

    setSaving(true);
    setErrorMsg("");

    try {
      const token = await user.getIdToken(true);

      await axios.put(
        `${API_BASE}/api/users/me`,
        { name, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("✅ Profile updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error("🔥 Error saving profile:", err);

      if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message);
      } else {
        setErrorMsg("Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">Edit Profile</h2>

      {errorMsg && (
        <p className="text-red-500 mb-3 text-center font-medium">{errorMsg}</p>
      )}

      <form onSubmit={handleSave} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Full Name"
          className="border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Your bio..."
          className="border p-2 rounded resize-none"
          rows="3"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          required
        />

        <button
          disabled={saving}
          className={`${
            saving ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          } text-white p-2 rounded transition`}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default EditProfile;
