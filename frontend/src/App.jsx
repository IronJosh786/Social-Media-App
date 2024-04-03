import "./App.css";
import store from "./app/store.js";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer.jsx";

function App() {
  return (
    <Provider store={store}>
      <Toaster richColors position="top-center" />
      <Router>
        <Navbar />
        <Footer />
      </Router>
    </Provider>
  );
}

export default App;
