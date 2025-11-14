import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };


  return (
    <div className="max-w-md mx-auto border p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          className="border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 rounded"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          required
        />
        <button className="bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Login
        </button>
        <h3 className="text-blue-600 cursor-pointer text-center"onClick={() => navigate("/signup")}>New user? Signup</h3>
      </form>
    </div>
  );
}

export default Login;
