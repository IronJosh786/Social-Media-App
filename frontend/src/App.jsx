import "./App.css";
import store from "./app/store.js";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Auth from "./components/Auth.jsx";
import Home from "./pages/Home.jsx";
import Profile from "./components/Profile.jsx";
import Posts from "./components/Posts.jsx";
import Explore from "./components/Explore.jsx";

function App() {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-center" />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Posts />} />
            <Route path="/explore" element={<Explore />} />
          </Route>
          <Route element={<Auth />}>
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
