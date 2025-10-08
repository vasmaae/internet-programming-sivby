import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import MyFiles from "./Pages/MyFiles";
import Starred from "./Pages/Starred";
import Basket from "./Pages/Basket";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/myfiles.html" element={<MyFiles />} />
            <Route path="/starred.html" element={<Starred />} />
            <Route path="/basket.html" element={<Basket />} />
            {/* Redirect to myfiles.html for the root path as a default */}
            <Route path="/" element={<MyFiles />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
