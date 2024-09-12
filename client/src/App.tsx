import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SettingsPage from "./pages/Settings";
import UserProfilePage from "./pages/UserProfile";
import Service from "./pages/global-settings/services";
import TreeTime from "./pages/global-settings/tree-time";
import Main from "./pages/global-settings/main";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />

        {/* global-settings */}
        <Route path="/global-settings/main" element={<Main />} />
        <Route path="/global-settings/services" element={<Service />} />
        <Route path="/global-settings/tree-time" element={<TreeTime />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
