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
import DetailedPost from "./components/DetailedPost.jsx";
import Bookmarks from "./components/Bookmarks.jsx";
import PendingRequests from "./components/PendingRequests.jsx";
import Search from "./components/Search.jsx";
import Followers from "./components/Followers.jsx";
import Followings from "./components/Followings.jsx";
import PublicProfile from "./components/PublicProfile.jsx";
import PreventAuth from "./components/PreventAuth.jsx";
import NotFound from "./components/NotFound.jsx";

function App() {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-center" />
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<PreventAuth />}>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
          </Route>
          <Route path="/" element={<Home />}>
            <Route path="/" element={<Posts />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/detailedPost/:id" element={<DetailedPost />} />
            <Route path="/search" element={<Search />} />
            <Route path="/user-profile/:id" element={<PublicProfile />} />
            <Route path="/" element={<Auth />}>
              <Route path="/pending-requests" element={<PendingRequests />} />
              <Route path="/followers" element={<Followers />} />
              <Route path="/followings" element={<Followings />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
