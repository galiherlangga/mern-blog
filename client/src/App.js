import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import About from "./pages/About";
import Article from "./pages/Article";
import ArticleList from "./pages/ArticleList";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar/>
      <div className="max-w-screen-md mx-auto mt-24">
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/article" element={<ArticleList/>} />
          <Route path="/article/:slug" element={<Article/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
