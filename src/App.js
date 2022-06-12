// import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Home from "./routes/Home";
import About from "./routes/About";
import Bim from "./routes/Projects/Bim";
import Undergraduated from "./routes/Projects/Undergraduated";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="About" element={<About />} />
          <Route path="Projects/Bim" element={<Bim />} />
          <Route path="Projects/Undergraduated" element={<Undergraduated />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
