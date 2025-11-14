import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import AddProject from './pages/AddProject';
import Login from './pages/Login';
import Signup from './pages/Signup'
import Navbar from './components/Navbar';
import EditProject from "./pages/EditProject";
import MyProjects from "./pages/MyProjects";
import ProjectDetails from "./pages/ProjectDetails";
import Favorites from './pages/Favorites.jsx';
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";

function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddProject />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/edit/:id" element={<EditProject />} />
          <Route path="/my-projects" element={<MyProjects />} />
          <Route path="/project/:id" element={<ProjectDetails />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/edit-profile" element={<EditProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
