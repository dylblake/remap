import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SettingsPage from "./pages/Settings";
import UserProfilePage from "./pages/UserProfile";
import GlobalSettings from "./pages/GlobalSettings/Main";
import UpdateServices from "./pages/GlobalSettings/UpdateServices";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/user-profile" element={<UserProfilePage />} />
        <Route path="/global-settings" element={<GlobalSettings />} />
        <Route path="/global-service-settings" element={<UpdateServices />} />
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}

export default App;
