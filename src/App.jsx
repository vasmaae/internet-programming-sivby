import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MyFiles from "./Pages/MyFiles";
import Starred from "./Pages/Starred";
import Basket from "./Pages/Basket";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./Pages/Home";
import About from "./Pages/About";

function App() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Router>
      <div
        style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Navbar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route
              path="/my-files"
              element={<MyFiles searchQuery={searchQuery} />}
            />
            <Route
              path="/starred"
              element={<Starred searchQuery={searchQuery} />}
            />
            <Route
              path="/basket"
              element={<Basket searchQuery={searchQuery} />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
