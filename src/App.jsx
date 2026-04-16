import { Outlet } from "react-router-dom";
import "./App.css";

function App() {
  return (
    <div className="app">
      <div className="bg-mesh" />

      <nav className="navbar">
        <div className="navbar-brand">
          <span className="brand-icon">✦</span>
          <h2>TodoFlow</h2>
        </div>
      </nav>

      <div className="main-content">
        <Outlet />
      </div>
    </div>
  );
}

export default App;