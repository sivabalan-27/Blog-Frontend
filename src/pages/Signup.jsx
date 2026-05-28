import { useState } from "react";
import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Signup Handler
  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div
      className="
        min-h-screen
        bg-[#050505]
        flex items-center justify-center
        px-6
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
          max-w-md
          bg-[#111111]/95
          backdrop-blur-xl
          border border-white/10
          rounded-3xl
          p-8
          shadow-2xl
        "
      >

        {/* Heading */}
        <div className="mb-8 text-center">

          <h2
            className="
              text-4xl
              font-extrabold
              text-white
              tracking-tight
            "
          >
            Create Account
          </h2>

          <p className="text-gray-500 mt-2 text-sm">
            Join the developer showcase platform
          </p>
        </div>

        {/* Error */}
        {error && (
          <div
            className="
              bg-[#6D001A]/20
              border border-[#6D001A]/40
              text-red-300
              text-sm
              rounded-xl
              px-4 py-3
              mb-5
            "
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form
          onSubmit={handleSignup}
          className="flex flex-col gap-5"
        >

          {/* Email */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
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
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-2">

            <label className="text-sm text-gray-400">
              Password
            </label>

            <input
              type="password"
              placeholder="Create a password"
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
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {/* Signup Button */}
          <button
            className="
              mt-2
              bg-[#6D001A]
              hover:bg-[#8B0023]
              text-white
              font-semibold
              py-3
              rounded-2xl
              transition-all duration-300
              hover:shadow-[0_0_30px_rgba(109,0,26,0.45)]
            "
          >
            Create Account
          </button>

          {/* Login Redirect */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="
              text-gray-400
              hover:text-white
              text-sm
              transition-all duration-300
            "
          >
            Already have an account?
            <span className="text-[#ff4d6d] ml-1">
              Login
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;


