import "./App.css";
// import GalleryView from "./Pages/GalleryView/GalleryView"
import Main from "./Components/Main/Main";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RouteError from "./Components/RouteError/RouteError";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Will change to gallery when home page is established */}
        <Route path="/" element={<Main />} />
        <Route
      path="*"
      element={
        <RouteError/>
      }
    />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
