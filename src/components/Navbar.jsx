import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { Menu, X } from "lucide-react"; // hamburger icons

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false); // mobile menu toggle
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleAddProject = async () => {
    if (!user) return navigate("/login");

    try {
      const token = await user.getIdToken(true);
      const res = await axios.get(`${API_BASE}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.profile;

      if (!profile.name || !profile.bio) {
        alert("Complete your profile before adding a project.");
        return navigate("/edit-profile");
      }

      navigate("/add");
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (err) {
      console.error("Error logging out:", err);
    }
  };

  return (
    <nav className="bg-black/85 text-white p-4 shadow-lg border-b border-[#1f1f1f]">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <h1
          onClick={() => navigate("/")}
          className="font-bold text-xl cursor-pointer hover:text-blue-400 transition"
        >
          Peer Project Hub
        </h1>

        {/* Hamburger Button — Mobile Only */}
        <button
          className="md:hidden p-2"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-blue-400 transition">
            Home
          </Link>

          {user && (
            <>
              <button
                onClick={handleAddProject}
                className="hover:text-blue-400 transition"
              >
                Add Project
              </button>

              <Link
                to="/my-projects"
                className="hover:text-blue-400 transition"
              >
                My Projects
              </Link>

              <Link to="/favorites" className="hover:text-blue-400 transition">
                Favorites
              </Link>

              <Link to="/profile" className="hover:text-blue-400 transition">
                Profile
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div className="md:hidden mt-4 flex flex-col bg-[#181818] border border-[#222] rounded-lg p-4 space-y-3 animate-slideDown">

          <Link
            to="/"
            className="hover:text-blue-400 transition"
            onClick={() => setOpen(false)}
          >
            Home
          </Link>

          {user && (
            <>
              <button
                onClick={() => {
                  setOpen(false);
                  handleAddProject();
                }}
                className="text-left hover:text-blue-400 transition"
              >
                Add Project
              </button>

              <Link
                to="/my-projects"
                onClick={() => setOpen(false)}
                className="hover:text-blue-400 transition"
              >
                My Projects
              </Link>

              <Link
                to="/favorites"
                onClick={() => setOpen(false)}
                className="hover:text-blue-400 transition"
              >
                Favorites
              </Link>

              <Link
                to="/profile"
                onClick={() => setOpen(false)}
                className="hover:text-blue-400 transition"
              >
                Profile
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={() => {
                setOpen(false);
                handleLogout();
              }}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 transition-all"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 transition-all"
            >
              Login
            </Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
