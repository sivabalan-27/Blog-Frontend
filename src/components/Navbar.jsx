import { Link, useNavigate } from "react-router-dom";
import { auth } from "../firebaseConfig";
import { useEffect, useState } from "react";
import { signOut, onAuthStateChanged } from "firebase/auth";
import axios from "axios";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const API_BASE =
    import.meta.env.VITE_API_URL || "http://localhost:3000";

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    <nav className="sticky top-0 z-50 bg-[#050505]/90 backdrop-blur-xl border-b border-white/10 shadow-[0_0_30px_rgba(109,0,26,0.08)]">
      
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        {/* <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold tracking-tight cursor-pointer "
        >
          Show<span className="text-[#8B0023]">Case</span>
        </h1> */}
        <h1
  onClick={() => navigate("/")}
  className="
    text-4xl
    font-black
    tracking-tight
    cursor-pointer
    select-none
  "
>
  <span className="text-white">Show</span>
  <span className="text-[#8B0023]">Case</span>
</h1>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white hover:text-[#ff4d6d] transition duration-300"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">

          <Link
            to="/"
            className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
          >
            Home
          </Link>

          {user && (
            <>
              <button
                onClick={handleAddProject}
                className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
              >
                Add Project
              </button>

              <Link
                to="/my-projects"
                className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
              >
                My Projects
              </Link>

              <Link
                to="/favorites"
                className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
              >
                Favorites
              </Link>

              <Link
                to="/profile"
                className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
              >
                Profile
              </Link>
            </>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-[#6D001A] hover:bg-[#8B0023] px-4 py-2 rounded-xl text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(109,0,26,0.4)]"
            >
              Logout
            </button>
          ) : (
            <Link
              to="/login"
              className="bg-[#6D001A] hover:bg-[#8B0023] px-4 py-2 rounded-xl text-white transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(109,0,26,0.4)]"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-6 pb-6">
          <div className="bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl">

            <Link
              to="/"
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
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
                  className="text-left text-gray-300 hover:text-[#ff4d6d] transition duration-300"
                >
                  Add Project
                </button>

                <Link
                  to="/my-projects"
                  onClick={() => setOpen(false)}
                  className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
                >
                  My Projects
                </Link>

                <Link
                  to="/favorites"
                  onClick={() => setOpen(false)}
                  className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
                >
                  Favorites
                </Link>

                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="text-gray-300 hover:text-[#ff4d6d] transition duration-300"
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
                className="bg-[#6D001A] hover:bg-[#8B0023] px-4 py-2 rounded-xl text-white transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="bg-[#6D001A] hover:bg-[#8B0023] px-4 py-2 rounded-xl text-white text-center transition-all duration-300"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

